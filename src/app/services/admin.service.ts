import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Storage } from "../enums/storage";
import { BehaviorSubject, Observable } from "rxjs";
import { Team } from "../interfaces/team";
import { StorageService } from "./storage.service";

@Injectable({
	providedIn: 'root'
})
export class AdminService implements OnDestroy {
    private _seriesInfo: BehaviorSubject<string>;
    private _seriesLength: BehaviorSubject<number>;
    private _teams: BehaviorSubject<Team[]>;
    private _nameLeft: BehaviorSubject<string>;
    private _nameRight: BehaviorSubject<string>;
    private _showDirector: BehaviorSubject<boolean>;
    private _forceDefaultColors: BehaviorSubject<boolean>;
    private _logoLeft: BehaviorSubject<string>;
    private _logoRight: BehaviorSubject<string>;
    private _hardReset: BehaviorSubject<boolean>;

    private interval: any;

    constructor(private _storage: StorageService) {
        this._seriesInfo = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.SERIES_INFO));
        this._seriesLength = new BehaviorSubject<number>(this._storage.getLocalEntry(Storage.SERIES_LENGTH));
        this._teams = new BehaviorSubject<Team[]>(this._storage.getLocalEntry(Storage.TEAMS));
        this._nameLeft = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.NAME_LEFT));
        this._nameRight = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.NAME_RIGHT));
        this._showDirector = new BehaviorSubject<boolean>(this._storage.getLocalEntry(Storage.SHOW_DIRECTOR));
        this._forceDefaultColors = new BehaviorSubject<boolean>(this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS));
        this._logoLeft = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.LOGO_LEFT));
        this._logoRight = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.LOGO_RIGHT));
        this._hardReset = new BehaviorSubject<boolean>(this._storage.getLocalEntry(Storage.HARD_RESET));
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    setup() {
        this.interval = setInterval(() => this.checkForChanges(), 1000);
    }

    checkForChanges(): void {
        if(this._storage.getLocalEntry(Storage.CHANGE)) {
            this._seriesInfo.next(this._storage.getLocalEntry(Storage.SERIES_INFO));
            this._seriesLength.next(this._storage.getLocalEntry(Storage.SERIES_LENGTH));
            this._teams.next(this._storage.getLocalEntry(Storage.TEAMS));
            this._nameLeft.next(this._storage.getLocalEntry(Storage.NAME_LEFT));
            this._nameRight.next(this._storage.getLocalEntry(Storage.NAME_RIGHT));
            this._showDirector.next(this._storage.getLocalEntry(Storage.SHOW_DIRECTOR));
            this._forceDefaultColors.next(this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS));
            this._logoLeft.next(this._storage.getLocalEntry(Storage.LOGO_LEFT));
            this._logoRight.next(this._storage.getLocalEntry(Storage.LOGO_RIGHT));
            this._hardReset.next(this._storage.getLocalEntry(Storage.HARD_RESET));
            this._storage.setLocalEntry(Storage.CHANGE, false);            
        }
    }

    get seriesInfo$(): Observable<string> {
        return this._seriesInfo.asObservable();
    }

    get seriesLength$(): Observable<number> {
        return this._seriesLength.asObservable();
    }

    get teams$(): Observable<Team[]> {
        return this._teams.asObservable();
    }

    get nameLeft$(): Observable<string> {
        return this._nameLeft.asObservable();
    }

    get nameRight$(): Observable<string> {
        return this._nameRight.asObservable();
    }

    get showDirector$(): Observable<boolean> {
        return this._showDirector.asObservable();
    }

    get forceDefaultColors$(): Observable<boolean> {
        return this._forceDefaultColors.asObservable();
    }

    get logoLeft$(): Observable<string> {
        return this._logoLeft.asObservable();
    }

    get logoRight$(): Observable<string> {
        return this._logoRight.asObservable();
    }

    get hardReset$(): Observable<boolean> {
        return this._hardReset.asObservable();
    }
}

