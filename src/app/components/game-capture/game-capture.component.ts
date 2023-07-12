import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-game-capture',
  templateUrl: './game-capture.component.html',
  styleUrls: ['./game-capture.component.scss']
})
export class GameCaptureComponent {
  gameAvailable: boolean = false;
  gameRunning: boolean = false;
  matchOverview: boolean = false;
  replay: boolean = false;
  director: boolean = false;

  constructor(
      private _ws: WebsocketService,
      private _data: DataService
      ) {
          _ws.init(49322);
          _data.init();
      }

  async ngOnInit(): Promise<void> {
      this._data.gameAvailable$.subscribe((gameAvailable: boolean) => {
          this.gameAvailable = gameAvailable;
      });
      this._data.gameRunning$.subscribe((gameRunning: boolean) => {
          this.gameRunning = gameRunning;
      });
      this._data.matchOverview$.subscribe(async (matchOverview: boolean) => {
          if(matchOverview) await new Promise(res => setTimeout(res, 4500));
          this.matchOverview = matchOverview;
      });
      this._data.director$.subscribe((director: boolean) => {
          this.director = director;
      });
      this._data.replay$.subscribe((replay: boolean) => {
          this.replay = replay;
      });
  }
}
