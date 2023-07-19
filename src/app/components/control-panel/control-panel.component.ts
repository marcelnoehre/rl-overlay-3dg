import { Component, OnInit } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  seriesInfo: string = this._storage.getLocalEntry(Storage.SERIES_INFO);
  seriesLength: number = this._storage.getLocalEntry(Storage.SERIES_INFO);
  seriesLeft: number = this._storage.getLocalEntry(Storage.TEAM_LEFT);
  seriesRight: number = this._storage.getLocalEntry(Storage.TEAM_RIGHT);
  names: string[] = ['TBA', 'TBA'];

  constructor(
    private _storage: StorageService,
    private _data: DataService
  ) {}

  ngOnInit(): void {
    this._data.teams$.subscribe((teams) => {
      this.names[0] = teams[0].name;
      this.names[1] = teams[1].name;
    });
  }

  updateSeries(): void {
    this._storage.setLocalEntry(Storage.SERIES_LENGTH, this.seriesLength);
    this._storage.setLocalEntry(Storage.SERIES_INFO, this.seriesInfo);
    this._storage.setLocalEntry(Storage.TEAM_LEFT, this.seriesLeft);
    this._storage.setLocalEntry(Storage.TEAM_RIGHT, this.seriesRight);
  }

  resetSeries(): void {
    this._storage.setLocalEntry(Storage.TEAM_LEFT, 0);
    this._storage.setLocalEntry(Storage.TEAM_RIGHT, 0);
    this.seriesLeft = 0;
    this.seriesRight = 0;
  }
}
