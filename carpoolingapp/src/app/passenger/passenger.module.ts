import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode'; // Importa el módulo aquí
import { IonicModule } from '@ionic/angular';

import { PassengerPageRoutingModule } from './passenger-routing.module';

import { PassengerPage } from './passenger.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassengerPageRoutingModule,
    QRCodeModule
  ],
  declarations: [PassengerPage]
})
export class PassengerPageModule {}
