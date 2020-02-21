import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerAddPage } from './player-add.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerAddPageRoutingModule {}
