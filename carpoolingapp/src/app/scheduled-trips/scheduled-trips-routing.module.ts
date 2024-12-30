import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduledTripsPage } from './scheduled-trips.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduledTripsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduledTripsPageRoutingModule {}
