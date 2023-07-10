import { Injectable } from "@angular/core";
import { Team } from "../interfaces/team";
import { Player } from "../interfaces/player";
import { Stats } from "../interfaces/stats";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageService } from "./storage.service";

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

    private mapping: { [key: string]: number } = {}
    private teams: Team[] = [];
    private players: Player[] = [];
    private stats!: Stats;

    constructor(private _storage: StorageService) {}

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
        this.stats = {
            ballPosession: [0, 0],
            boostConsumption: [0, 0]
        }
    }

    setTeamInformation(team: number, name: string, color: string): void {
        this.teams[team].name = name;
        this.teams[team].color = color;
        this.setGameAvailable(true);
    }

    setTeamScore(team: number, score: number) {
        this.teams[team].score = score;
    }

    setTeamWins() {
        this.teams[0].wins = this._storage.getLocalEntry('team-0');
        this.teams[1].wins = this._storage.getLocalEntry('team-1');
    }

    setTeams(): void {
        this._teams.next(this.teams);
    }

    setPlayerId(id: string, name: string, team: number): void {
        this.mapping[id] = this.players.length;
        this.players.push({
            id: id,
            name: name,
            team: team,
            score: 0,
            goals: 0,
            assists: 0,
            saves: 0,
            shots: 0,
            boost: 33,
            target: false
        });
    }

    setPlayerStats(id: string, score: number, goals: number, assists: number, saves: number, shots: number, boost: number, target: boolean) {
        this.players[this.mapping[id]].score = score;
        this.players[this.mapping[id]].goals = goals;
        this.players[this.mapping[id]].assists = assists;
        this.players[this.mapping[id]].saves = saves;
        this.players[this.mapping[id]].shots = shots;
        if(this.players[this.mapping[id]].boost > boost) {
            this.setBoostConsumption(this.players[this.mapping[id]].team, this.players[this.mapping[id]].boost - boost);
        }
        this.players[this.mapping[id]].boost = boost;
        this.players[this.mapping[id]].target = target;
    }

    setPlayers(): void {
        this._players.next([
            this.players.filter(player => this.mapping.hasOwnProperty(player.id) && player.team === 0),
            this.players.filter(player => this.mapping.hasOwnProperty(player.id) && player.team === 1)
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

    setBallPossesion(team: number): void {
        this.stats.ballPosession[team]++;
    }

    setBoostConsumption(team: number, boost: number): void {
        this.stats.boostConsumption[team] += boost;
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