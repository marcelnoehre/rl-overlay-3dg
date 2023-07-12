import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameCaptureComponent } from './components/game-capture/game-capture.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';

const routes: Routes = [
  {
    path: '', component: GameCaptureComponent
  },
	{
		path: 'control-panel', component: ControlPanelComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
