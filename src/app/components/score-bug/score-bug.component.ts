import { Component, OnInit } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

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
  seriesLength: number = this._storage.getLocalEntry(Storage.SERIES_LENGTH);
  seriesInfo: string = this._storage.getLocalEntry(Storage.SERIES_INFO);

  constructor(
    private _data: DataService,
    private _storage: StorageService
    ) {}

  ngOnInit(): void {
    this._storage.seriesChange$.subscribe((length) => {
      this.seriesLength = length;
    });
    this._storage.seriesInfoChange$.subscribe((info) => {
      this.seriesInfo = info;
    });
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
