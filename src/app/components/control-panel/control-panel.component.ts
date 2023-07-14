import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  seriesInfo: string = this._storage.getLocalEntry('series-info');
  seriesLength: number = this._storage.getLocalEntry('series-length');
  seriesLeft: number = this._storage.getLocalEntry('team-0');
  seriesRight: number = this._storage.getLocalEntry('team-1');
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
    this._storage.setLocalEntry('series-length', this.seriesLength);
    this._storage.setLocalEntry('series-info', this.seriesInfo);
    this._storage.setLocalEntry('team-0', this.seriesLeft);
    this._storage.setLocalEntry('team-1', this.seriesRight);
  }

  resetSeries(): void {
    this._storage.setLocalEntry('team-0', 0);
    this._storage.setLocalEntry('team-1', 0);
    this.seriesLeft = 0;
    this.seriesRight = 0;
  }
}
