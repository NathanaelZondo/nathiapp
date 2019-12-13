import { Component, NgZone } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
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
   profile = {} as Profile 
   token
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private pass : PassInformationServiceService,
    public ngZone: NgZone,
    // private oneSignal: OneSignal,
    private alertCtrl: AlertController,
  ) {
    firebase.initializeApp(config)
    this.initializeApp();
    
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.router.navigateByUrl("/home");
        console.log('not logged in');
        
        unsubscribe();
      } else {
this.ngZone.run(()=>{
  
  this.router.navigateByUrl("/home");
  console.log('logged in');
  unsubscribe();
})
  }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.initUpdate()
        // this.setupPush();
       }
      // this.statusBar.styleDefault();
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#387336')
      // this.splashScreen.hide();
    });
  }
  /*
  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit('eb1dd5d9-19ad-4e2b-a93a-6540efa172d5', '743242408134');

    this.oneSignal.getIds().then((res) => {

      console.log("OneSignal User ID:", res.userId);
      // (Output) OneSignal User ID: 270a35cd-4dda-4b3f-b04e-41d7463a2316    
    });

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;

      this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();
  }
  */
  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    })
    alert.present();
  }
  initUpdate(){
   
if (this.token) {
  firebase.firestore().collection('Tokens').add({
    TokenID: this.token
  })

}
  }

}
export interface Profile  {
  name : string
}
