import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SafeUrl } from '@angular/platform-browser';
import { Storage } from 'src/app/enums/storage';
import { Team } from 'src/app/interfaces/team';
import { AdminService } from 'src/app/services/admin.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  seriesInfo: string = this._storage.getLocalEntry(Storage.SERIES_INFO) || '';
  seriesLength: number = this._storage.getLocalEntry(Storage.SERIES_LENGTH) || 3;
  seriesLeft: number = this._storage.getLocalEntry(Storage.SERIES_LEFT) || 0;
  seriesRight: number = this._storage.getLocalEntry(Storage.SERIES_RIGHT) || 0;
  logoLeft: SafeUrl = this._storage.getLocalEntry(Storage.LOGO_LEFT);
  logoRight: SafeUrl = this._storage.getLocalEntry(Storage.LOGO_RIGHT);
  teams: Team[] = this._storage.getLocalEntry(Storage.TEAMS);
  showDirector: boolean = this._storage.getLocalEntry(Storage.DIRECTOR) || true;
  defaultColors: boolean = this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS) || false;

  constructor(
    private _storage: StorageService,
    private _admin: AdminService
  ) {}

  ngOnInit(): void {
    if(!this.teams) {
      this.teams = [{
        name: '',
        color: '',
        score: 0,
        wins: 0,
        players: []
      }, {
        name: '',
        color: '',
        score: 0,
        wins: 0,
        players: []
      }];
    }
    this._admin.teams$.subscribe((teams) => {
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
          if(team === 0) {
            this.logoLeft = e.target?.result as string;
          } else {
            this.logoRight = e.target?.result as string;
          }
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
    this._storage.setLocalEntry(Storage.CHANGE, true);
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
    this._storage.setLocalEntry(Storage.NAME_LEFT, this.teams[0].name);
    this._storage.setLocalEntry(Storage.NAME_RIGHT, this.teams[1].name);
    this._storage.setLocalEntry(Storage.SHOW_DIRECTOR, this.showDirector);
    this._storage.setLocalEntry(Storage.LOGO_LEFT, this.logoLeft);
    this._storage.setLocalEntry(Storage.LOGO_RIGHT, this.logoRight);
    this._storage.setLocalEntry(Storage.FORCE_DEFAULT_COLORS, this.defaultColors);
    this._storage.setLocalEntry(Storage.CHANGE, true);
  }

  clearTeams(): void {
    this.teams[0].name = '';
    this.teams[1].name = '';
    this.removeLogo(0);
    this.removeLogo(1);
  }

  removeLogo(team: number): void {
    if(team === 0) {
      this.logoLeft = this._storage.getLocalEntry('');
    } else {
      this.logoRight = this._storage.getLocalEntry('');
    }
  }

  async hardReset(): Promise<void> {
    this._storage.setLocalEntry(Storage.HARD_RESET, true);
    this._storage.setLocalEntry(Storage.CHANGE, true);
    await new Promise<void>(done => setTimeout(() => done(), 1500));
    window.location.reload();
  }
}
