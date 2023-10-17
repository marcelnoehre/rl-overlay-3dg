import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Goal } from "../interfaces/goal";
import { Event } from "../interfaces/event";

@Injectable({
	providedIn: 'root'
})
export class EventService {
    private _goalScored: BehaviorSubject<Goal> = new BehaviorSubject<Goal>({scorer: '', assistant: '', speed: '', team: -1});
    private _statfeedEvent: BehaviorSubject<Event> = new BehaviorSubject<Event>({eventName: '', mainId: '', secondaryId: ''});

    showGoalScored(scorer: string, speed: number, team: number, assistant?: string): void {
        this._goalScored.next({scorer: scorer, assistant: assistant, speed: Math.round((speed + Number.EPSILON) * 100) / 100 + 'km/h', team: team});
    }
    
    statfeedEvent(eventName: string, mainId: string, secondaryId: string): void {
        this._statfeedEvent.next({eventName: eventName, mainId: mainId, secondaryId: secondaryId});
    }

    get goalScored$(): Observable<Goal> {
        return this._goalScored.asObservable();
    }

    get statfeedEvent$(): Observable<Event> {
        return this._statfeedEvent.asObservable();
    }
}