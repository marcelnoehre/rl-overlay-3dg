import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Storage } from 'src/app/enums/storage';
import { AdminService } from 'src/app/services/admin.service';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-game-capture',
  templateUrl: './game-capture.component.html',
  styleUrls: ['./game-capture.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', animate('1.25s ease-in-out')),
      transition(':leave', animate('0.75s ease-in-out'))
    ])
  ]
})
export class GameCaptureComponent {
  password: string = '';
  gameAvailable: boolean = false;
  gameRunning: boolean = false;
  matchOverview: boolean = false;
  replay: boolean = false;
  director: boolean = false;
  showDirector: boolean = true;

  constructor(
      private _ws: WebsocketService,
      private _admin: AdminService,
      private _data: DataService,
      private _storage: StorageService
      ) {
          _storage.clearLocal();
          _ws.init(49322);
          _data.init();
      }

  async ngOnInit(): Promise<void> {
    this._admin.password$.subscribe((password: string) => {
        this.password = password;
    });
    this._data.gameAvailable$.subscribe((gameAvailable: boolean) => {
        this.gameAvailable = gameAvailable;
    });
    this._data.gameRunning$.subscribe((gameRunning: boolean) => {
        this.gameRunning = gameRunning;
    });
    this._data.matchOverview$.subscribe(async (matchOverview: boolean) => {
        if(matchOverview) await new Promise(res => setTimeout(res, 6500));
        this.matchOverview = matchOverview;
    });
    this._data.director$.subscribe((director: boolean) => {
        this.director = director;
    });
    this._data.replay$.subscribe((replay: boolean) => {
        this.replay = replay;
    });
    this._admin.setup();
    this._admin.showDirector$.subscribe((showDirector) => {
        this.showDirector = showDirector;
    });
    this._admin.hardReset$.subscribe((hardReset) => {
        if(hardReset) {
            this._storage.clearLocal();
            this._storage.setLocalEntry(Storage.HARD_RESET, false);
            window.location.reload();
        }
    });
}

    show(): boolean {
        return this.password === 'f6f9ff2557df787d2b2aab25033e9850f9f1a49830234ddb6c32ce570aea1d81';
    }
}
