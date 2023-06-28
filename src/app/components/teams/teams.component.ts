import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.services';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  players: Player[][] = [];

  constructor(private _data: DataService) {}

  ngOnInit(): void {
    this._data.players$.subscribe((players: Player[][]) => {
      this.players = players;
    });
    this._data.teams$.subscribe((teams: Team[]) => {
      this.teams = teams;
    });
  }
}
