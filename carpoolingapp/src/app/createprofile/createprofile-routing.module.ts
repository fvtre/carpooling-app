import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateProfilePage } from './createprofile.page';

const routes: Routes = [
  {
    path: '',
    component: CreateProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateprofilePageRoutingModule {}
