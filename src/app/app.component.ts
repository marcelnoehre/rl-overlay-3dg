import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { DataService } from './services/data.services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'rl-overlay-3dg';

    constructor(
        private _ws: WebsocketService,
        private _data: DataService
        ) {
        _ws.init(49322);
        _data.init();
    }
}
