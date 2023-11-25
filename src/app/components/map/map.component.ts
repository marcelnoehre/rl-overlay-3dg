import { Component, OnDestroy, OnInit } from '@angular/core';
import { Team } from 'src/app/interfaces/team';
import { Player } from 'src/app/interfaces/player';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  ball: number[] = [];
  teams: Team[] = [];
  players: Player[][] = [];
  playerSubscription!: Subscription; 

  constructor(
    private _data: DataService
  ) {}

  ngOnInit(): void {
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams;
    });
    this.playerSubscription = this._data.players$.subscribe((players: Player[][]) => {
      this.players = players.map((playerArray: Player[]) => {
        return playerArray.map((player: Player) => {
          player.x = this.mapCoordinate(player.x, 4080, -4080, 250, 0, 12);
          player.y = this.mapCoordinate(player.y, 5200, -5200, 319, 0, 12);
          return player;
        });
      });
    });
    this._data.ball$.subscribe((ball: number[]) => {
      this.ball = [
        this.mapCoordinate(ball[0], 4080, -4080, 250, 0, 14),
        this.mapCoordinate(ball[1], 5200, -5200, 319, 0, 14),
      ];
    });
  }

  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }

  mapCoordinate(original: number, originalMax: number, originalMin: number, mappedMax: number, mappedMin: number, circleSize: number): number {
    let value = (((original - originalMin) * ((mappedMax - circleSize) - mappedMin)) / (originalMax - originalMin)) + mappedMin;
    if (value < mappedMin) return mappedMin;
    if (value > (mappedMax - circleSize)) return (mappedMax - circleSize);
    return value;
  }
}