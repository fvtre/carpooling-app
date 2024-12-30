import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateprofilePageRoutingModule } from './createprofile-routing.module';

import { CreateProfilePage } from './createprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateprofilePageRoutingModule,
    ReactiveFormsModule // Asegúrate de que esté aquí

  ],
  declarations: [CreateProfilePage]
})
export class CreateprofilePageModule {}
