import { Component, OnInit } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { Team } from 'src/app/interfaces/team';
import { AdminService } from 'src/app/services/admin.service';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-score-bug',
  templateUrl: './score-bug.component.html',
  styleUrls: ['./score-bug.component.scss']
})
export class ScoreBugComponent implements OnInit {
  teams: Team[] = [];
  nameLeft: string = '';
  nameRight: string = '';
  gameRunning: boolean = false;
  isOvertime: boolean = false;
  gameTime: string = '';
  wins: boolean[][] = [];
  nameSizeLeft: string = '';
  nameSizeRight: string = '';
  forceDefaultColors: boolean = this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS);
  seriesLength: number = this._storage.getLocalEntry(Storage.SERIES_LENGTH);
  seriesInfo: string = this._storage.getLocalEntry(Storage.SERIES_INFO);
  logoLeft: string = this._storage.getLocalEntry(Storage.LOGO_LEFT);
  logoRight: string = this._storage.getLocalEntry(Storage.LOGO_RIGHT);

  constructor(
    private _admin: AdminService,
    private _data: DataService,
    private _storage: StorageService
    ) {}

  ngOnInit(): void {
    this._admin.seriesInfo$.subscribe((seriesInfo) => {
      this.seriesInfo = seriesInfo;
    });
    this._admin.seriesLength$.subscribe((seriesLength) => {
      this.seriesLength = seriesLength;
    });
    this._admin.logoLeft$.subscribe((logoLeft) => {
      this.logoLeft = logoLeft;
    });
    this._admin.logoRight$.subscribe((logoRight) => {
      this.logoRight = logoRight;
    });
    this._admin.forceDefaultColors$.subscribe((forceDefaultColors) => {
      this.forceDefaultColors = forceDefaultColors;
    });
    this._admin.teams$.subscribe((teams) => {
      this.teams = teams;
      this.setupTeams();
    });
    this._admin.nameLeft$.subscribe((nameLeft) => {
      this.nameLeft = nameLeft;
      this.setupTeams();
    });
    this._admin.nameRight$.subscribe((nameRight) => {
      this.nameRight = nameRight;
      this.setupTeams();
    });
    this._data.gameRunning$.subscribe((gameRunning) => {
      this.gameRunning = gameRunning;
    });
    this._data.overtime$.subscribe((isOvertime) => {
      this.isOvertime = isOvertime;
    });
    this._data.teams$.subscribe((teams) => {
      this.teams = teams;
      this.setupTeams();
    });
    this._data.gametime$.subscribe((gameTime) => {
      this.gameTime = gameTime;
    });
  }

  setupTeams(): void {
    if(this.nameLeft) this.teams[0].name = this.nameLeft;
    if(this.nameRight) this.teams[1].name = this.nameRight;
    this.nameSizeLeft = this.teams[0].name.length <= 10 ? '50px' : `${50 - 4 * (this.teams[0].name.length - 10)}px`;
    this.nameSizeRight = this.teams[1].name.length <= 10 ? '50px' : `${50 - 4 * (this.teams[1].name.length - 10)}px`;
    this.wins = [
      Array.from({ length: this.seriesLength }, (_, i) => i < this.teams[0].wins),
      Array.from({ length: this.seriesLength }, (_, i) => i < this.teams[1].wins).reverse()
    ];
  } 
}
