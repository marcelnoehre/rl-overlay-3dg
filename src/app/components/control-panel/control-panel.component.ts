import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SafeUrl } from '@angular/platform-browser';
import { Storage } from 'src/app/enums/storage';
import { Team } from 'src/app/interfaces/team';
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
  seriesLeft: number = this._storage.getLocalEntry(Storage.SERIES_LEFT);
  seriesRight: number = this._storage.getLocalEntry(Storage.SERIES_RIGHT);
  logoLeft: SafeUrl = this._storage.getLocalEntry(Storage.LOGO_LEFT);
  logoRight: SafeUrl = this._storage.getLocalEntry(Storage.LOGO_RIGHT);
  teams: Team[] = this._storage.getLocalEntry(Storage.TEAMS);
  showDirector: boolean = this._storage.getLocalEntry(Storage.DIRECTOR);
  defaultColors: boolean = this._storage.getLocalEntry(Storage.DEFAULT_COLORS);

  constructor(
    private _storage: StorageService,
    private _data: DataService
  ) {}

  ngOnInit(): void {
    this._data.teams$.subscribe((teams) => {
      this.teams = teams;
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
    this._storage.setLocalEntry(Storage.SERIES_LEFT, this.seriesLeft);
    this._storage.setLocalEntry(Storage.SERIES_RIGHT, this.seriesRight);
  }

  resetSeries(): void {
    this._storage.setLocalEntry(Storage.SERIES_LEFT, 0);
    this._storage.setLocalEntry(Storage.SERIES_RIGHT, 0);
    this.seriesLeft = 0;
    this.seriesRight = 0;
  }

  toggleDirector(event: MatSlideToggleChange): void {
    this.showDirector = event.checked;
  }

  toggleDefaultColors(event: MatSlideToggleChange): void {
    this.defaultColors = event.checked;
  }

  updateTeams(): void {
    this._storage.setLocalEntry(Storage.TEAMS, this.teams);
    this._storage.setLocalEntry(Storage.DIRECTOR, this.showDirector);
    this._storage.setLocalEntry(Storage.DEFAULT_COLORS, this.defaultColors);
    this._storage.setLocalEntry(Storage.LOGO_LEFT, this.logoLeft);
    this._storage.setLocalEntry(Storage.LOGO_RIGHT, this.logoRight);
    this._storage.setLocalEntry(Storage.DEFAULT_COLORS, this.defaultColors);
  }

  clearTeams(): void {
    this.teams[0].name = '';
    this.teams[1].name = '';
    this._storage.setLocalEntry(Storage.TEAMS, this.teams);
    this.removeLogo(0);
    this.removeLogo(1);
    this.updateLogos();
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
