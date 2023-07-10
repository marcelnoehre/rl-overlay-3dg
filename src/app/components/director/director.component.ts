import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { Team } from 'src/app/interfaces/team';
import { DataService } from 'src/app/services/data.services';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']
})
export class DirectorComponent implements OnInit {
  teams: Team[] = [];
  target: Player[] = [];
  targetBoost: String = '0%';

  constructor(private _data: DataService) {}

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
  }
}
