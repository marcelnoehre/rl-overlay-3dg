import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { GameCaptureComponent } from './components/game-capture/game-capture.component';
import { ScoreBugComponent } from './components/score-bug/score-bug.component';
import { TeamsComponent } from './components/teams/teams.component';
import { DirectorComponent } from './components/director/director.component';
import { ReplayComponent } from './components/replay/replay.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';

import { DataService } from './services/data.service';
import { EventService } from './services/event.service';
import { StorageService } from './services/storage.service';
import { WebsocketService } from './services/websocket.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    GameCaptureComponent,
    ScoreBugComponent,
    TeamsComponent,
    DirectorComponent,
    ReplayComponent,
    ControlPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  providers: [DataService, EventService, StorageService, WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
