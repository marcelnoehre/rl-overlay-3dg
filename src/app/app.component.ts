import { Component, OnDestroy } from '@angular/core';
import { StorageService } from './services/storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {
    title = 'rl-overlay-3dg'

    constructor(private _storage: StorageService) {}
    
    ngOnDestroy(): void {
        this._storage.clearLocal();
    }

}
