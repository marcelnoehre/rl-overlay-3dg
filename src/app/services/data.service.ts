import { Injectable } from "@angular/core";
import { Team } from "../interfaces/team";
import { Player } from "../interfaces/player";
import { Stats } from "../interfaces/stats";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageService } from "./storage.service";
import { Storage } from "../enums/storage";
import { AdminService } from "./admin.service";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private _teams: BehaviorSubject<Team[]> = new BehaviorSubject<Team[]>([]);
    private _players: BehaviorSubject<Player[][]> = new BehaviorSubject<Player[][]>([]);
    private _gametime: BehaviorSubject<string> = new BehaviorSubject<string>('5:00');
    private _gameAvailable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _gameRunning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _matchOverview: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _overtime: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _replay: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _director: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private mapping: { [key: string]: Player } = {}
    private teams: Team[] = [];

    constructor(
        private _storage: StorageService,
        private _admin: AdminService
        ) {}

    init(): void {
        this.teams.push({
            name: '',
            color: '',
            score: 0,
            wins: 0,
            players: []
        });
        this.teams.push({
            name: '',
            color: '',
            score: 0,
            wins: 0,
            players: []
        });
        this._storage.setLocalEntry(Storage.TEAMS, this.teams);
        this._admin.teams$.subscribe((teams) => {
            if(teams.length > 0) {
                this.teams = teams;
            }
            this.setTeams();
        });
    }

    resetMatch(): void {
        this.mapping = {};
        this.setPlayers();
    }

    setTeamInformation(team: number, name: string, color: string): void {
        this.teams[team].name = name;
        this.teams[team].color = color;
        this._storage.setLocalEntry(Storage.TEAMS, this.teams);
        this.setGameAvailable(true);
    }

    setTeamScore(team: number, score: number, matchoverview: boolean) {
        if(!matchoverview) {
            this.teams[team].score = score;
        }
    }

    setTeamWins() {
        this.teams[0].wins = this._storage.getLocalEntry(Storage.SERIES_LEFT);
        this.teams[1].wins = this._storage.getLocalEntry(Storage.SERIES_RIGHT);
    }

    setTeams(): void {
        this._teams.next(this.teams);
    }

    setPlayerId(id: string, name: string, team: number): void {
        if(!this.mapping[id]) {
            this.mapping[id] = {
                id: id,
                name: name,
                team: team,
                score: 0,
                goals: 0,
                assists: 0,
                saves: 0,
                shots: 0,
                boost: 33,
                target: false,
                demos: 0,
                touches: 0,
                boostConsumption: 0,
                speed: 0,
                ticks: 0
            };
        }
    }

    setPlayerStats(id: string, team: number, score: number, goals: number, assists: number, saves: number, shots: number, boost: number, target: boolean, demos: number, touches: number, speed: number, clockActive: boolean, matchOverview: boolean) {
        if(!matchOverview) {
            this.mapping[id].score = score;
            this.mapping[id].goals = goals;
            this.mapping[id].assists = assists;
            this.mapping[id].saves = saves;
            this.mapping[id].shots = shots;
            if(this.mapping[id].boost > boost) {
                this.mapping[id].boostConsumption += this.mapping[id].boost - boost;
            }
            this.mapping[id].boost = boost;
            this.mapping[id].target = target;
            this.mapping[id].demos = demos;
            this.mapping[id].touches = touches;
            if(clockActive) {
                this.mapping[id].ticks++;
                this.mapping[id].speed += speed;
            }
        }
    }

    setPlayers(): void {
        this._players.next([
            Object.values(this.mapping).filter(player => player.team === 0),
            Object.values(this.mapping).filter(player => player.team === 1)
        ]);
    }

    setGameAvailable(gameAvailable: boolean): void {
        this._gameAvailable.next(gameAvailable);
    }

    setGameRunning(gameRunning: boolean): void {
        this._gameRunning.next(gameRunning);
    }

    setMatchOverview(matchOverview: boolean): void {
        this._matchOverview.next(matchOverview);
    }

    setGameTime(time: number): void {
        const remainingSeconds: string = (time % 60) < 10 ? '0' + time % 60 : '' + time % 60;
        this._gametime.next(`${Math.floor(time / 60)}:${remainingSeconds}`);
    }

    setOvertime(overtime: boolean): void {
        this._overtime.next(overtime);
    }

    setReplay(replay: boolean): void {
        this._replay.next(replay);
    }

    setDirector(director: boolean): void {
        this._director.next(director);
    }

    removePlayer(id: string) {
        delete this.mapping[id];
    }

    get teams$(): Observable<Team[]> {
        return this._teams.asObservable();
    }

    get players$(): Observable<Player[][]> {
        return this._players.asObservable();
    }

    get gameAvailable$(): Observable<boolean> {
        return this._gameAvailable.asObservable();
    }

    get gameRunning$(): Observable<boolean> {
        return this._gameRunning.asObservable();
    }

    get matchOverview$(): Observable<boolean> {
        return this._matchOverview.asObservable();
    }

    get gametime$(): Observable<string> {
        return this._gametime.asObservable();
    }

    get overtime$(): Observable<boolean> {
        return this._overtime.asObservable();
    }
    
    get replay$(): Observable<boolean> {
        return this._replay.asObservable();
    }

    get director$(): Observable<boolean> {
        return this._director.asObservable();
    }
}