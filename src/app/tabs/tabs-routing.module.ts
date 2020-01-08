import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  } from "../allnewpages/profile/profile.module";
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {

    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'applyTournament',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../allnewpages/apply-tournament/apply-tournament.module').then(m => m.ApplyTournamentPageModule)
          }
        ]
      },
      {
        path: 'manageTeam',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../allnewpages/manage-team/manage-team.module').then(m => m.ManageTeamPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../allnewpages/profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../allnewpages/registerpage/registerpage.module').then(m => m.RegisterpagePageModule)
          }
        ]
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../allnewpages/login/login-routing.module').then(m => m.LoginPageRoutingModule)
          }
        ]
      },
      {
        path: 'faqs',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../allnewpages/faqs/faqs.module').then(m => m.FaqsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
