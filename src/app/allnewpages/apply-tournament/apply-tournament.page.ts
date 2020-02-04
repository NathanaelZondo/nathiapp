import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, LoadingController } from '@ionic/angular';
import { PassInformationServiceService } from 'src/app/service/pass-information-service.service';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-apply-tournament',
  templateUrl: './apply-tournament.page.html',
  styleUrls: ['./apply-tournament.page.scss'],
})
export class ApplyTournamentPage implements OnInit {

  constructor(public pass: PassInformationServiceService,
    public alertController: AlertController,
    public authService: AuthServiceService,
    public passService: PassInformationServiceService,
    public loadingController: LoadingController,
    public store: NativeStorage,
    public router: Router) { }


  ngOnInit() {

  }

  back() {
    this.router.navigateByUrl('home')
  }

  routerToProfile() {
    this.router.navigateByUrl('tabs/profile')
  }

}
