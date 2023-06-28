import { Injectable } from "@angular/core";
import { DataService } from "./data.services";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private subscribers: { [channel: string]: { [event: string]: Function[] } } = {};
    private webSocket!: WebSocket;
    private webSocketConnected = false;
    private registerQueue: string[] = [];
    private data: DataService = new DataService;

    init(port: number = 49322): void {
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
    }

    setup(): void {
        this.subscribe('game', ['initialized', 'match_destroyed'], () => {
            this.data.setMatchOverview(false);
            this.data.setGameAvailable(true);
        });
        this.subscribe('game', ['match_ended'], () => {
            this.data.setGameAvailable(false);
            //update series wins
        });
        this.subscribe('game', ['podium_start'], () => {
            this.data.setMatchOverview(true);
        });
        this.subscribe('game', ['replay_start'], () => {
            this.data.setReplay(true);
        });
        this.subscribe('game', ['replay_end'], () => {
            this.data.setReplay(false);
        }); 
        this.subscribe('game', ['update_state'], (data: any) => {
            //TODO:

            //SetTeamInformation (1st)
            //SetPlayerID (1st)
            //SetTeamScore
            //SetTeamWins
            //SetPlayerStats
            //SetPlayers$
            //SetGameTime (+ if ot)
            //SetOvertime
            //setBoostConsumption
            //removePlayer
            console.dir(data);
        });
        this.subscribe('game', ['ball_hit'], (data: any) => {
            //TODO: update ballPossession
            console.dir(data);
        });
        this.subscribe('game', ['statfeed_event'], (data: any) => {
            //TODO: throw events
            console.dir(data);
        });
        this.subscribe('game', ['goal_scored'], (data: any) => {
            //TODO: handle goal
            console.dir(data);
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