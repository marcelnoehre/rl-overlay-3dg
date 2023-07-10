import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ScoreBugComponent } from './components/score-bug/score-bug.component';
import { TeamsComponent } from './components/teams/teams.component';
import { DirectorComponent } from './components/director/director.component';
import { ReplayComponent } from './components/replay/replay.component';

import { DataService } from './services/data.service';
import { EventService } from './services/event.service';
import { StorageService } from './services/storage.service';
import { WebsocketService } from './services/websocket.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    ScoreBugComponent,
    TeamsComponent,
    DirectorComponent,
    ReplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatProgressBarModule
  ],
  providers: [DataService, EventService, StorageService, WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
