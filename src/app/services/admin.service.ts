import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { StorageService } from "./storage.service";
import { Storage } from "../enums/storage";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class AdminService implements OnDestroy {
    private _seriesInfo: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private _seriesLength: BehaviorSubject<number> = new BehaviorSubject<number>(3);
    private _showDirector: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _forceDefaultColors: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _nameChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private _logoLeft: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private _logoRight: BehaviorSubject<string> = new BehaviorSubject<string>('');

    private interval = setInterval(this.checkForChanges, 1000);
    

    constructor(private _storage: StorageService) {}

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    checkForChanges(): void {
        if(this._storage.getLocalEntry(Storage.CHANGE)) {
            this._seriesInfo.next(this._storage.getLocalEntry(Storage.SERIES_INFO));
            this._seriesLength.next(this._storage.getLocalEntry(Storage.SERIES_LENGTH));
            this._showDirector.next(this._storage.getLocalEntry(Storage.SHOW_DIRECTOR));
            this._forceDefaultColors.next(this._storage.getLocalEntry(Storage.SHOW_DIRECTOR));
            this._nameChange.next(this._storage.getLocalEntry(Storage.NAME_CHANGE));
            this._logoLeft.next(this._storage.getLocalEntry(Storage.LOGO_LEFT));
            this._logoRight.next(this._storage.getLocalEntry(Storage.LOGO_RIGHT));
        }
    }

    get seriesInfo$(): Observable<string> {
        return this._seriesInfo.asObservable();
    }

    get seriesLength$(): Observable<number> {
        return this._seriesLength.asObservable();
    }

    get showDirector$(): Observable<boolean> {
        return this._showDirector.asObservable();
    }

    get forceDefaultColors$(): Observable<boolean> {
        return this._forceDefaultColors.asObservable();
    }

    get nameChange$(): Observable<string[]> {
        return this._nameChange.asObservable();
    } 

    get logoLeft$(): Observable<string> {
        return this._logoLeft.asObservable();
    }

    get logoRight$(): Observable<string> {
        return this._logoRight.asObservable();
    }
}

