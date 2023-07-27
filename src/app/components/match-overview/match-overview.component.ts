import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {
  teams: Team[] = [];

  constructor(
    private _data: DataService
  ) {

  }

  ngOnInit(): void {
    this._data.teams$.subscribe((teams) => {
      this.teams = teams;
    });
  }

}
