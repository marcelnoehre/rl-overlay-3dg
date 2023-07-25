import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { EventService } from "./event.service";
import { StorageService } from "./storage.service";
import { Storage } from "../enums/storage";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private subscribers: { [channel: string]: { [event: string]: Function[] } } = {};
    private webSocket!: WebSocket;
    private webSocketConnected = false;
    private registerQueue: string[] = [];
    private setupDone: boolean = false;
    private activePlayers: string[] = [];
    private gameRunning: boolean = false;

    constructor(
        private _storage: StorageService,
        private _data: DataService,
        private _event: EventService
        ) {}

    init(port: number = 49122): void {
        this.webSocket = new WebSocket(`ws://localhost:${port}`);

        this.webSocket.onmessage = (event) => {
            const jEvent = JSON.parse(event.data);
            if (!jEvent.hasOwnProperty('event')) {
                return;
            }
            const eventSplit = jEvent.event.split(':');
            const channel = eventSplit[0];
            const event_event = eventSplit[1];
            this.triggerSubscribers(channel, event_event, jEvent.data);
        };

        this.webSocket.onopen = () => {
            this.triggerSubscribers("ws", "open");
            this.webSocketConnected = true;
            this.registerQueue.forEach((r) => {
                this.send("wsRelay", "register", r);
            });
            this.registerQueue = [];
        };

        this.webSocket.onerror = () => {
            this.triggerSubscribers("ws", "error");
            this.webSocketConnected = false;
        };

        this.webSocket.onclose = () => {
            this.triggerSubscribers("ws", "close");
            this.webSocketConnected = false;
        };
        this._data.gameRunning$.subscribe((gameRunning: boolean) => {
            this.gameRunning = gameRunning;
        });
        this.setup();
    }

    setup(): void {
        if(!this._storage.getLocalEntry(Storage.HAS_GAME)) {
            this._storage.clearLocal();
            this._storage.setLocalEntry(Storage.TEAMS, []);
            this._storage.setLocalEntry(Storage.SERIES_LENGTH, 3);
            this._storage.setLocalEntry(Storage.SERIES_INFO, '');
            this._storage.setLocalEntry(Storage.HAS_GAME, true);
            this._storage.setLocalEntry(Storage.DIRECTOR, false);
            this._storage.setLocalEntry(Storage.SERIES_LEFT, 0);
            this._storage.setLocalEntry(Storage.LOGO_LEFT, 'assets/images/default-logo-0.png');
            this._storage.setLocalEntry(Storage.SERIES_RIGHT, 0);
            this._storage.setLocalEntry(Storage.LOGO_RIGHT, 'assets/images/default-logo-1.png');
            this._storage.setLocalEntry(Storage.SHOW_DIRECTOR, true);
            this._storage.setLocalEntry(Storage.FORCE_DEFAULT_COLORS, false);
            this._storage.setLocalEntry(Storage.CHANGE, false);
        }
        this.subscribe('game', ['initialized', 'pre_countdown_begin'], () => {
            this._data.setMatchOverview(false);
            this._data.setGameAvailable(true);
            this._data.setGameRunning(true);
        });
        this.subscribe('game', ['match_destroyed'], (data: any) => {
            this._data.resetMatch();
        });
        this.subscribe('game', ['match_ended'], (data: any) => {
            this._data.setGameRunning(false);
            //TODO: removed till matchoverview is finished
            // this._data.setGameAvailable(false);
            this._storage.setLocalEntry('series-' + data.winner_team_num, this._storage.getLocalEntry('series-' + data.winner_team_num) + 1);
            this._data.setTeamWins();
        });
        this.subscribe('game', ['podium_start'], () => {
            this._data.setMatchOverview(true);
        });
        this.subscribe('game', ['replay_start'], () => {
            this._data.setGameRunning(false);
            this._data.setReplay(true);
        });
        this.subscribe('game', ['replay_end'], () => {
            this._data.setReplay(false);
        }); 
        this.subscribe('game', ['update_state'], (data: any) => {
            if(!this.setupDone && data.game.teams) {
                this._data.setTeamInformation(0, data.game.teams[0].name, '#' + data.game.teams[0].color_primary);
                this._data.setTeamInformation(1, data.game.teams[1].name, '#' + data.game.teams[1].color_primary);
                this.setupDone = true;
            }
            for (const key in data.players) {
                if(!this.activePlayers.includes(key)) {
                    this.activePlayers.push(key);
                this._data.setPlayerId(key, data.players[key].name, data.players[key].team);
                }
                for(const player of this.activePlayers) {
                    if(!data.players.hasOwnProperty(player)) {
                        this._data.removePlayer(player);
                        this.activePlayers = this.activePlayers.filter((active) => active !== player);
                    }
                }
                this._data.setPlayerStats(key, data.players[key].score, data.players[key].goals, data.players[key].assists, data.players[key].saves, data.players[key].shots, data.players[key].boost, data.game.target === key);
            }
            if(!this.gameRunning) this._data.setGameRunning( data.game.ball.team !== 255);
            this._data.setDirector(data.game.hasTarget && !data.game.isReplay);
            this._data.setTeamScore(0, data.game.teams[0].score);
            this._data.setTeamScore(1, data.game.teams[1].score);
            this._data.setTeamWins();
            this._data.setTeams();
            this._data.setGameTime(data.game.time_seconds);
            this._data.setOvertime(data.game.isOT);
            this._data.setPlayers();
        });
        this.subscribe('game', ['ball_hit'], (data: any) => {
            //TODO: update ballPossession
        });
        this.subscribe('game', ['statfeed_event'], (data: any) => {
            //TODO: throw events
        });
        this.subscribe('game', ['goal_scored'], (data: any) => {
            this._event.fireGoalScored(data.scorer.name, data.goalspeed, data.scorer.teamnum, data.scorer.assister);
        });
    }

    subscribe(channels: string | string[], events: string[], callback: Function): void {
        if (typeof channels === "string") {
            channels = [channels];
        }
        if (typeof events === "string") {
            events = [events];
        }
        channels.forEach((c: string) => {
            events.forEach((e: string) => {
                if (!this.subscribers.hasOwnProperty(c)) {
                    this.subscribers[c] = {};
                }
                if (!this.subscribers[c].hasOwnProperty(e)) {
                    this.subscribers[c][e] = [];
                    if (this.webSocketConnected) {
                        this.send("wsRelay", "register", `${c}:${e}`);
                    } else {
                        this.registerQueue.push(`${c}:${e}`);
                    }
                }
                this.subscribers[c][e].push(callback);
            });
        });
    }

    clearEventCallbacks(channel: string, event: string): void {
        if (this.subscribers.hasOwnProperty(channel) && this.subscribers[channel].hasOwnProperty(event)) {
            this.subscribers[channel] = {};
        }
    }

    triggerSubscribers(channel: string, event: string, data?: any): void {
        if (this.subscribers.hasOwnProperty(channel) && this.subscribers[channel].hasOwnProperty(event)) {
            this.subscribers[channel][event].forEach((callback: Function) => {
                if (callback instanceof Function) {
                    callback(data);
                }
            });
        }
    }

    send(channel: string, event: string, data: any): void {
        if (typeof channel !== 'string') {
            console.error("Channel must be a string");
            return;
        }
        if (typeof event !== 'string') {
            console.error("Event must be a string");
            return;
        }
        if (channel === 'local') {
            this.triggerSubscribers(channel, event, data);
        } else {
            const cEvent = channel + ":" + event;
            this.webSocket.send(JSON.stringify({
                'event': cEvent,
                'data': data
            }));
        }
    }
}