import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTournamentPage } from './view-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTournamentPageRoutingModule {}
