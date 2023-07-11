import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-score-bug',
  templateUrl: './score-bug.component.html',
  styleUrls: ['./score-bug.component.scss']
})
export class ScoreBugComponent implements OnInit {
  teams: Team[] = [];
  gameTime: string = '';
  wins: boolean[][] = [];
  nameSizeLeft: string = '';
  nameSizeRight: string = '';
  //TODO: read from file
  seriesLength: number = 3;
  matchInformation: string = 'Nitro League Division 2.3 - Woche 3';

  constructor(private _data: DataService) {}

  ngOnInit(): void {
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams;
      this.nameSizeLeft = teams[0].name.length <= 10 ? '50px' : `${50 - 4 * (teams[0].name.length - 10)}px`;      
      this.nameSizeRight = teams[1].name.length <= 10 ? '50px' : `${50 - 4 * (teams[1].name.length - 10)}px`;   
      this.wins = [
        Array.from({ length: this.seriesLength }, (_, i) => i < this.teams[0].wins),
        Array.from({ length: this.seriesLength }, (_, i) => i < this.teams[1].wins)
      ];
    });
    this._data.gametime$.subscribe((gameTime) => {
      this.gameTime = gameTime;
    });
  }
}
