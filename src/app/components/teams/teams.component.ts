import { Component, OnInit } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { Player } from 'src/app/interfaces/player';
import { Team } from 'src/app/interfaces/team';
import { AdminService } from 'src/app/services/admin.service';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  players: Player[][] = [];
  forceDefaultColors: boolean = this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS);

  constructor(
    private _data: DataService,
    private _admin: AdminService,
    private _storage: StorageService) {}

  ngOnInit(): void {0
    this._admin.forceDefaultColors$.subscribe((forceDefaultColors) => {
      this.forceDefaultColors = forceDefaultColors;
    });
    this._data.players$.subscribe((players: Player[][]) => {
      this.players = players;
    });
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams;
    });
  }
}
