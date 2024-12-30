import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Asegúrate de que la ruta es correcta

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' 
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'recover-password',
    loadChildren: () => import('./recover-password/recover-password.module').then( m => m.RecoverPasswordPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'driver',
    loadChildren: () => import('./driver/driver.module').then( m => m.DriverPageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: 'create-trip',
    loadChildren: () => import('./create-trip/create-trip.module').then( m => m.CreateTripPageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: 'trip-created',
    loadChildren: () => import('./trip-created/trip-created.module').then( m => m.TripCreatedPageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: 'passenger',
    loadChildren: () => import('./passenger/passenger.module').then( m => m.PassengerPageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: 'scheduled-trips',
    loadChildren: () => import('./scheduled-trips/scheduled-trips.module').then( m => m.ScheduledTripsPageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: 'schedule-trip',
    loadChildren: () => import('./schedule-trip/schedule-trip.module').then( m => m.ScheduleTripPageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard] // Aplicando el guard aquí
  },
  {
    path: 'createprofile',
    loadChildren: () => import('./createprofile/createprofile.module').then( m => m.CreateprofilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
