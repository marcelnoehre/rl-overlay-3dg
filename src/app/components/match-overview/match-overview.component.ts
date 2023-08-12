import { KeyedWrite } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { Team } from 'src/app/interfaces/team';
import { AdminService } from 'src/app/services/admin.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss']
})
export class MatchOverviewComponent implements OnInit {
  teams: Team[] = [];
  players: Player[][] = [];
  forceDefaultColors: boolean = false;
  keys: string[] = ['goals', 'assists', 'saves', 'shots', 'score', 'demos', 'touches'];
  extraKeys: string[] = ['boostConsumption', 'speed'];
  max: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  averages: string[] = [];
  mvp: any[] = [];

  constructor(
    private _data: DataService,
    private _admin: AdminService
  ) { }

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
    this._admin.forceDefaultColors$.subscribe((forceDefaultColors) => {
      this.forceDefaultColors = forceDefaultColors;
    });
    let i: number = 0;
    for(const key of this.keys) {
      let sums: number[] = [0, 0];
      this.players[0].forEach((player) => {
        sums[0] += Number(player[key]);
        if(this.max[i] < Number(player[key])) this.max[i] = Number(player[key]);
      });
      this.players[1].forEach((player) => {
        sums[1] += Number(player[key]);
        if(this.max[i] < Number(player[key])) this.max[i] = Number(player[key]);
      });
      this.averages.push((sums[0] + sums[1] === 0 ? 50 : 7.5 + (sums[0] / (sums[0] + sums[1])) * (92.5 - 7.5)) + '%');
      i++;
    }
    for(const key of this.extraKeys) {
      let sums: number[] = [0, 0];
      this.players[0].forEach((player) => {
        sums[0] += Number(player[key]);
        if(this.max[i] < Number(player[key])) this.max[i] = Number(player[key]);
      });
      this.players[1].forEach((player) => {
        sums[1] += Number(player[key]);
        if(this.max[i] < Number(player[key])) this.max[i] = Number(player[key]);
      });
      this.averages.push((sums[0] + sums[1] === 0 ? 50 : 7.5 + (sums[0] / (sums[0] + sums[1])) * (92.5 - 7.5)) + '%');
      i++;
    }
    let goals: number[] = [0, 0];
    let scores: number[] = [0, 0];
    this.players[0].forEach((player) => {
      goals[0] += player.goals;
      if(scores[0] < player.score) scores[0] = player.score;
    });
    this.players[1].forEach((player) => {
      goals[1] += player.goals;
      if(scores[1] < player.score) scores[1] = player.score;
    });
    this.mvp[0] = goals[0] > goals[1] ? 0 : 1;
    this.mvp[1] = scores[this.mvp[0]];
  }
}
