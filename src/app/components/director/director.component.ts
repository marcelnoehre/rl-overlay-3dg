import { Component, OnInit } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { Player } from 'src/app/interfaces/player';
import { Team } from 'src/app/interfaces/team';
import { AdminService } from 'src/app/services/admin.service';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
export class DirectorComponent implements OnInit {
  teams: Team[] = [];
  target: Player[] = [];
  targetBoost: String = '0%';
  color: string = '#303f55';
  forceDefaultColors: boolean = this._storage.getLocalEntry(Storage.FORCE_DEFAULT_COLORS);

  constructor(
    private _data: DataService,
    private _admin: AdminService,
    private _storage: StorageService) {}

  ngOnInit(): void {
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams;
    });
    this._data.players$.subscribe((players: Player[][]) => {
      if(players[0].filter(player => player.target).length > 0) {
        this.target = players[0].filter(player => player.target);
      }
      if(players[1].filter(player => player.target).length > 0) {
        this.target = players[1].filter(player => player.target);
      }
      this.targetBoost = (this.target.length > 0 ? (this.target[0].boost / 100) * 25 + 75 : 0) + '%';
    });
    this._admin.forceDefaultColors$.subscribe((forceDefaultColors) => {
      this.forceDefaultColors = forceDefaultColors;
    });
  }

  get activeColor(): string {
    this.color = this.teams[this.target[0].team].color;
    if(this.forceDefaultColors) {
      this.color = this.target[0].team === 0 ? '#1873FF' : '#C26418';
    }
    return this.color;
  }
}
