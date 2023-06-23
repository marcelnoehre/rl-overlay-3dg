import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Goal } from "../interfaces/goal";

@Injectable({
	providedIn: 'root'
})
export class EventService {
    private _goalScored: BehaviorSubject<Goal> = new BehaviorSubject<Goal>({scorer: '', assistant: '', speed: ''});

    fireGoalScored(scorer: string, speed: number, assistant?: string): void {
        this._goalScored.next({scorer: scorer, assistant: assistant, speed: speed + 'km/h'});
    }

    get eventGoalScored$(): Observable<Goal> {
        return this._goalScored.asObservable();
    }
}