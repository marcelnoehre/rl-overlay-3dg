import { Component, OnInit } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { Event } from 'src/app/interfaces/event';
import { Player } from 'src/app/interfaces/player';
import { Team } from 'src/app/interfaces/team';
import { AdminService } from 'src/app/services/admin.service';
import { DataService } from 'src/app/services/data.service';
import { EventService } from 'src/app/services/event.service';
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
  statfeedEvents: string[][][] = [[[],[],[]],[[],[],[]]];
  validEvents: string[] = ['Assist', 'DemolishMain', 'DemolishSecondary', 'EpicSave', 'Goal', 'HatTrick', 'OvertimeGoal', 'Playmaker', 'Save', 'Savior', 'Shot'];

  constructor(
    private _data: DataService,
    private _admin: AdminService,
    private _storage: StorageService,
    private _event: EventService) {}

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
    this._event.statfeedEvent$.subscribe((event: Event) => {
      if (event.eventName === 'Demolish') {
        this.retrieveStatFeedEvent('DemolishMain', event.mainId);
        this.retrieveStatFeedEvent('DemolishSecondary', event.secondaryId);
      } else {
        this.retrieveStatFeedEvent(event.eventName, event.mainId);
      }
    });
  }

  retrieveStatFeedEvent(icon: string, id: string) {
    if(!this.validEvents.includes(icon)) return;
    for(let i = 0; i < this.players.length; i++) {
      const index = this.players[i].findIndex(player => player.id === id);
      if(index >= 0) {
        this.statfeedEvents[i][index].push(icon);
        if(this.statfeedEvents[i][index].length === 1) this.showStatfeedEvent(i, index);
      }
    }
  }

  showStatfeedEvent(team: number, player: number) {
    this.players[team][player].statfeedEvent = this.statfeedEvents[team][player][0];
    setTimeout(() => this.removeFromQueue(team, player), 3000);
  }

  removeFromQueue(team: number, player: number) {
    this.players[team][player].statfeedEvent = '';
    this.statfeedEvents[team][player].shift();
    if (this.statfeedEvents[team][player].length > 0) this.showStatfeedEvent(team, player);
  }
}

