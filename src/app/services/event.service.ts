import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Goal } from "../interfaces/goal";
import { Event } from "../interfaces/event";

@Injectable({
	providedIn: 'root'
})
export class EventService {
    private _goalScored: BehaviorSubject<Goal> = new BehaviorSubject<Goal>({scorer: '', assistant: '', speed: '', team: -1});
    private _eventGoal: BehaviorSubject<Event> = new BehaviorSubject<Event>({mainId: '', secondaryId: ''});
    private _eventAssist: BehaviorSubject<Event> = new BehaviorSubject<Event>({mainId: '', secondaryId: ''});
    private _eventSave: BehaviorSubject<Event> = new BehaviorSubject<Event>({mainId: '', secondaryId: ''});
    private _eventEpicSave: BehaviorSubject<Event> = new BehaviorSubject<Event>({mainId: '', secondaryId: ''});
    private _eventDemoLish: BehaviorSubject<Event> = new BehaviorSubject<Event>({mainId: '', secondaryId: ''});
    private _eventHatTrick: BehaviorSubject<Event> = new BehaviorSubject<Event>({mainId: '', secondaryId: ''});
    private _eventPlayMaker: BehaviorSubject<Event> = new BehaviorSubject<Event>({mainId: '', secondaryId: ''});

    showGoalScored(scorer: string, speed: number, team: number, assistant?: string): void {
        this._goalScored.next({scorer: scorer, assistant: assistant, speed: Math.round((speed + Number.EPSILON) * 100) / 100 + 'km/h', team: team});
    }

    eventGoal(mainId: string, secondaryId: string): void {
        this._eventGoal.next({mainId: mainId, secondaryId: secondaryId});
    }

    eventAssist(mainId: string, secondaryId: string): void {
        this._eventAssist.next({mainId: mainId, secondaryId: secondaryId});
    }

    eventSave(mainId: string, secondaryId: string): void {
        this._eventSave.next({mainId: mainId, secondaryId: secondaryId});
    }

    eventEpicSave(mainId: string, secondaryId: string): void {
        this._eventEpicSave.next({mainId: mainId, secondaryId: secondaryId});
    }

    eventDemoLish(mainId: string, secondaryId: string): void {
        this._eventDemoLish.next({mainId: mainId, secondaryId: secondaryId});
    }

    eventHatTrick(mainId: string, secondaryId: string): void {
        this._eventHatTrick.next({mainId: mainId, secondaryId: secondaryId});
    }
    
    eventPlayMaker(mainId: string, secondaryId: string): void {
        this._eventPlayMaker.next({mainId: mainId, secondaryId: secondaryId});
    }

    get goalScored$(): Observable<Goal> {
        return this._goalScored.asObservable();
    }

    get eventGoal$(): Observable<Event> {
        return this._eventGoal.asObservable();
    }

    get eventAssist$(): Observable<Event> {
        return this._eventAssist.asObservable();
    }

    get eventSave$(): Observable<Event> {
        return this._eventSave.asObservable();
    }

    get eventEpicSave$(): Observable<Event> {
        return this._eventEpicSave.asObservable();
    }

    get eventDemoLish$(): Observable<Event> {
        return this._eventDemoLish.asObservable();
    }

    get eventHatTrick$(): Observable<Event> {
        return this._eventHatTrick.asObservable();
    }

    get eventPlayMaker$(): Observable<Event> {
        return this._eventPlayMaker.asObservable();
    }
}