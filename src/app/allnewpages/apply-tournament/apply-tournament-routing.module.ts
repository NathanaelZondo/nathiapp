import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyTournamentPage } from './apply-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: ApplyTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplyTournamentPageRoutingModule {}
