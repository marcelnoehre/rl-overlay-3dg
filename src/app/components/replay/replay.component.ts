import { Component, OnInit } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { Goal } from 'src/app/interfaces/goal';
import { Team } from 'src/app/interfaces/team';
import { AdminService } from 'src/app/services/admin.service';
import { DataService } from 'src/app/services/data.service';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss']
})
export class ReplayComponent implements OnInit {
  goal!: Goal;
  teams: Team[] = [];
  color: string = '#303f55';
  forceDefaultColors: boolean = this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS);

  constructor(
    private _event: EventService,
    private _data: DataService,
    private _admin: AdminService,
    private _storage: StorageService) {}

  ngOnInit(): void {
    this._event.eventGoalScored$.subscribe((goal: Goal) => {
      this.goal = goal;
    });
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams;
    });
    this._admin.forceDefaultColors$.subscribe((forceDefaultColors) => {
      this.forceDefaultColors = forceDefaultColors;
    });
  }

  get activeColor(): string {    
    this.color = this.teams[this.goal.team].color;
    if(this.forceDefaultColors) {
      this.color = this.goal.team === 0 ? '#1873FF' : '#C26418';
    }
    return this.color;
  }
}