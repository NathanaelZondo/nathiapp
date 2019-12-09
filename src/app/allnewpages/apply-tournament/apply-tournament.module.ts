import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplyTournamentPageRoutingModule } from './apply-tournament-routing.module';

import { ApplyTournamentPage } from './apply-tournament.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplyTournamentPageRoutingModule
  ],
  declarations: [ApplyTournamentPage]
})
export class ApplyTournamentPageModule {}
