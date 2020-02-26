import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)},
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuardService]
  },
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
  {
    path: 'faqs',
    loadChildren: () => import('./allnewpages/faqs/faqs.module').then( m => m.FaqsPageModule)
  },
  {
    path: 'view-tournament',
    loadChildren: () => import('./allnewpages/view-tournament/view-tournament.module').then( m => m.ViewTournamentPageModule)
  },
  {
    path: 'view-match',
    loadChildren: () => import('./allnewpages/view-match/view-match.module').then( m => m.ViewMatchPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./allnewpages/onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },  {
    path: 'player-add',
    loadChildren: () => import('./player-add/player-add.module').then( m => m.PlayerAddPageModule)
  },
  {
    path: 'no-network',
    loadChildren: () => import('./allnewpages/no-network/no-network.module').then( m => m.NoNetworkPageModule)
  },


  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
