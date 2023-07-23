import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Storage } from "../enums/storage";
import { BehaviorSubject, Observable } from "rxjs";
import { Team } from "../interfaces/team";
import { StorageService } from "./storage.service";

@Injectable({
	providedIn: 'root'
})
export class AdminService implements OnDestroy {
    private _seriesInfo: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private _seriesLength: BehaviorSubject<number> = new BehaviorSubject<number>(3);
    private _teams: BehaviorSubject<Team[]>;
    private _showDirector: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _forceDefaultColors: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _logoLeft: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private _logoRight: BehaviorSubject<string> = new BehaviorSubject<string>('');

    private interval: any;

    constructor(private _storage: StorageService) {
        this._seriesInfo = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.SERIES_INFO));
        this._seriesLength = new BehaviorSubject<number>(this._storage.getLocalEntry(Storage.SERIES_LENGTH));
        this._teams = new BehaviorSubject<Team[]>(this._storage.getLocalEntry(Storage.TEAMS));
        this._showDirector = new BehaviorSubject<boolean>(this._storage.getLocalEntry(Storage.SHOW_DIRECTOR));
        this._forceDefaultColors = new BehaviorSubject<boolean>(this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS));
        this._logoLeft = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.LOGO_LEFT));
        this._logoRight = new BehaviorSubject<string>(this._storage.getLocalEntry(Storage.LOGO_RIGHT));
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
            this._showDirector.next(this._storage.getLocalEntry(Storage.SHOW_DIRECTOR));
            this._forceDefaultColors.next(this._storage.getLocalEntry(Storage.SHOW_DIRECTOR));
            this._logoLeft.next(this._storage.getLocalEntry(Storage.LOGO_LEFT));
            this._logoRight.next(this._storage.getLocalEntry(Storage.LOGO_RIGHT));
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
}

