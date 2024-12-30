import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleTripPage } from './schedule-trip.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleTripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleTripPageRoutingModule {}
