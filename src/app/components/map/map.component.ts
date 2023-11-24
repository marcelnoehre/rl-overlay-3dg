import { Component } from '@angular/core';
import { Team } from 'src/app/interfaces/team';
import { Player } from 'src/app/interfaces/player';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  teams: Team[] = [];
  players: Player[][] = [];

  constructor(
    private _data: DataService
  ) {}

  ngOnInit(): void {
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams.map((team: Team) => {
        team.color = team.color + 'b3';
        return team;
      });
    });
    this._data.players$.subscribe((players: Player[][]) => {
      this.players = players.map((playerArray: Player[]) => {
        return playerArray.map((player: Player) => {
          player.x = this.mapCoordinate(player.x, 4080, -4080, 188, 0);
          player.y = this.mapCoordinate(player.y, 5200, -5200, 242, 0);
          return player;
        });
      });
    });
  }

  mapCoordinate(original: number, originalMax: number, originalMin: number, mappedMax: number, mappedMin: number): number {
    return (((original - originalMin) * (mappedMax - mappedMin)) / (originalMax - originalMin)) + mappedMin
  }
}