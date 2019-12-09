import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageTeamPageRoutingModule } from './manage-team-routing.module';

import { ManageTeamPage } from './manage-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTeamPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ManageTeamPage]
})
export class ManageTeamPageModule {}
