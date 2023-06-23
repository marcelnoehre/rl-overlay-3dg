import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.services';

@Component({
  selector: 'app-score-bug',
  templateUrl: './score-bug.component.html',
  styleUrls: ['./score-bug.component.scss']
})
export class ScoreBugComponent implements OnInit {
  teams: Team[] = [];
  gameTime: string = '';
  wins: boolean[][] = [];
  //TODO: read from file
  seriesLength: number = 3; 
  matchInformation: string = 'Nitro League Division 2.3 - Woche 3';

  constructor(private _data: DataService) {}

  ngOnInit(): void {
    this.wins = [
      Array.from({ length: this.seriesLength }, () => false),
      Array.from({ length: this.seriesLength }, () => false)
    ];
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams;
      if(teams[0].wins-1 !== -1) this.wins[0][teams[0].wins-1] = true;
      if(teams[1].wins-1 !== -1) this.wins[1][teams[1].wins-1] = true;
    });
    this._data.gametime$.subscribe((gameTime) => {
      this.gameTime = gameTime;
    });
  }
}
