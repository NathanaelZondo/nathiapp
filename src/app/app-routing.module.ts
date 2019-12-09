import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'add-player',
    loadChildren: () => import('./allnewpages/add-player/add-player.module').then( m => m.AddPlayerPageModule)
  },
  {
    path: 'add-team',
    loadChildren: () => import('./allnewpages/add-team/add-team.module').then( m => m.AddTeamPageModule)
  },
  // {
  //   path: 'applytournament',
  //   loadChildren: () => import('./allnewpages/applytournament/applytournament.module').then( m => m.ApplytournamentPageModule)
  // },
  {
    path: 'apply-tournament',
    loadChildren: () => import('./allnewpages/apply-tournament/apply-tournament.module').then( m => m.ApplyTournamentPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./allnewpages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'manage-team',
    loadChildren: () => import('./allnewpages/manage-team/manage-team.module').then( m => m.ManageTeamPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./allnewpages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'registerpage',
    loadChildren: () => import('./allnewpages/registerpage/registerpage.module').then( m => m.RegisterpagePageModule)
  },
  {
    path: 'errorpage',
    loadChildren: () => import('./allnepages/errorpage/errorpage.module').then( m => m.ErrorpagePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
