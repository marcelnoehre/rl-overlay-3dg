import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Goal } from "../interfaces/goal";

@Injectable({
	providedIn: 'root'
})
export class EventService {
    private _goalScored: BehaviorSubject<Goal> = new BehaviorSubject<Goal>({scorer: '', assistant: '', speed: '', team: -1});

    fireGoalScored(scorer: string, speed: number, team: number, assistant?: string): void {
        this._goalScored.next({scorer: scorer, assistant: assistant, speed: Math.round((speed + Number.EPSILON) * 100) / 100 + 'km/h', team: team});
    }

    get eventGoalScored$(): Observable<Goal> {
        return this._goalScored.asObservable();
    }
}