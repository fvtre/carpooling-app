import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleTripPageRoutingModule } from './schedule-trip-routing.module';

import { ScheduleTripPage } from './schedule-trip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleTripPageRoutingModule
  ],
  declarations: [ScheduleTripPage]
})
export class ScheduleTripPageModule {}
