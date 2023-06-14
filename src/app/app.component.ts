import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    title = 'rl-overlay-3dg';

    constructor(private _ws: WebsocketService) {
        _ws.init(49322);
    }
}
