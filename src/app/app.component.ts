import { Component, NgZone } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { PassInformationServiceService } from './service/pass-information-service.service';
import * as firebase from 'firebase';
import {config} from './firebaseConfig'
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  role
  //  profile = {} as Profile 
   token
   o
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private pass : PassInformationServiceService,
    public ngZone: NgZone,
    private alertCtrl: AlertController,
  ) {
    
    this.initializeApp();
    
    
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.router.navigateByUrl("/tabs");
        console.log('not logged in');
        
        unsubscribe();
      } else {
this.ngZone.run(()=>{
  
  this.router.navigateByUrl("/tabs");
  console.log('logged in');
  unsubscribe();
})
  }
    });
  }

  initializeApp() {

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        // this.initUpdate();
       }
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#387336')

    });
  }

}

