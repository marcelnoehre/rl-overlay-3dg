import { Component, OnInit } from '@angular/core';
import { Goal } from 'src/app/interfaces/goal';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss']
})
export class ReplayComponent implements OnInit {
  goal!: Goal;

  constructor(private _event: EventService) {}

  ngOnInit(): void {
    this._event.eventGoalScored$.subscribe((goal: Goal) => {
      this.goal = goal;
    });
  }
}