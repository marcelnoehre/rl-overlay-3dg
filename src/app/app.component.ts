import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { DataService } from './services/data.services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    gameAvailable: boolean = false;
    replay: boolean = false;
    director: boolean = false;

    constructor(
        private _ws: WebsocketService,
        private _data: DataService
        ) {
            _ws.init(49322);
            _data.init();
        }

    ngOnInit(): void {
        this._data.gameAvailable$.subscribe((gameAvailable: boolean) => {
            this.gameAvailable = gameAvailable;
        });
        this._data.director$.subscribe((director: boolean) => {
            this.director = director;
        });
        this._data.replay$.subscribe((replay: boolean) => {
            this.replay = replay;
        });
    }
}
