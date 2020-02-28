import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoNetworkPage } from './no-network.page';

const routes: Routes = [
  {
    path: '',
    component: NoNetworkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoNetworkPageRoutingModule {}
