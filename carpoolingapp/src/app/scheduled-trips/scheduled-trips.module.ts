import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduledTripsPageRoutingModule } from './scheduled-trips-routing.module';

import { ScheduledTripsPage } from './scheduled-trips.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduledTripsPageRoutingModule
  ],
  declarations: [ScheduledTripsPage]
})
export class ScheduledTripsPageModule {}
