import { Component, OnDestroy } from '@angular/core';
import { StorageService } from './services/storage.service';
import { AdminService } from './services/admin.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnDestroy {
    title = 'rl-overlay-3dg'

    constructor(
        private _storage: StorageService,
        private _admin: AdminService
        ) {}
    
    ngOnDestroy(): void {
        this._storage.clearLocal();
    }

}
