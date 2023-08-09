import { KeyedWrite } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {
  teams: Team[] = [];
  players: Player[][] = [];
  keys: string[] = ['score', 'goals', 'assists', 'saves', 'shots', 'demos', 'touches'];
  extraKeys: string[] = ['boostConsumption', 'speed'];
  averages: string[] = [];

  constructor(private _data: DataService) { }

  ngOnInit(): void {
  this._data.teams$.subscribe((teams) => {
      this.teams = teams;
    });
    this._data.players$.subscribe((players) => {
      this.players = [...players];
    });
    this.players.forEach((teams) => {
      teams.forEach((player) => {
        player.speed = parseFloat((player.speed / player.ticks).toFixed(2));
      });
    });
    for(const key of this.keys) {
      let sums: number[] = [0, 0];
      this.players[0].forEach((player) => {
        sums[0] += Number(player[key]);
      });
      this.players[1].forEach((player) => {
        sums[1] += Number(player[key]);
      });
      this.averages.push((sums[0] + sums[1] === 0 ? 50 : 7.5 + (sums[0] / (sums[0] + sums[1])) * (92.5 - 7.5)) + '%');
    }
    for(const key of this.extraKeys) {
      let sums: number[] = [0, 0];
      this.players[0].forEach((player) => {
        sums[0] += Number(player[key]);
      });
      this.players[1].forEach((player) => {
        sums[1] += Number(player[key]);
      });
      this.averages.push((sums[0] + sums[1] === 0 ? 50 : 7.5 + (sums[0] / (sums[0] + sums[1])) * (92.5 - 7.5)) + '%');
    }
  }
}
