import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
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
  seriesLength: number = this._storage.getLocalEntry(Storage.SERIES_LENGTH);
  seriesLeft: number = this._storage.getLocalEntry(Storage.TEAM_LEFT);
  seriesRight: number = this._storage.getLocalEntry(Storage.TEAM_RIGHT);
  logoLeft: SafeUrl = this._storage.getLocalEntry(Storage.LOGO_LEFT);
  logoRight: SafeUrl = this._storage.getLocalEntry(Storage.LOGO_RIGHT);
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

  onFileSelected(event: Event, team: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if(file.type.startsWith("image/")) {
        const reader = new FileReader;
        reader.onload = (e) => {
          this._storage.setLocalEntry('logo-' + team, e.target?.result as string);
          this.updateLogos();
        };
        reader.readAsDataURL(file);
      }
    }
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

  updateTeams(): void {

  }

  clearTeams(): void {

  }

  removeLogo(team: number): void {
    this._storage.deleteLocalEntry('logo-' + team);
    this.updateLogos();
  }

  private updateLogos(): void {
    this.logoLeft = this._storage.getLocalEntry(Storage.LOGO_LEFT);
    this.logoRight = this._storage.getLocalEntry(Storage.LOGO_RIGHT);
  }
}
