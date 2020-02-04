import { Component, NgZone } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { PassInformationServiceService } from './service/pass-information-service.service';
import * as firebase from 'firebase';
import {config} from './firebaseConfig'
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeStorage } from "@ionic-native/native-storage/ngx";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  role
  //  profile = {} as Profile 
   token =null
   o

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router : Router,
    private pass : PassInformationServiceService,
    public ngZone: NgZone,
    private alertCtrl: AlertController,
    private fcm : FCM,
    private nativeStorage: NativeStorage
  ) {
    
    this.initializeApp();
    this.ngZone.run(() =>{
      this.fcm.getToken().then(token => {
        this.token = token
        console.log('token',token);
        firebase.firestore().collection('testToken').add({
          token: token,
          timeStamp : new Date
        })
        });
        this.runProcesses()
        
    })
  }
  runProcesses() {
    this.nativeStorage.getItem('doneOnboarding').then( res => {
      if (res == true) {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          if (!user) {
            this.router.navigateByUrl("/tabs");
  
            unsubscribe();
  
          } else {
      this.ngZone.run(()=>{
      // if(this.token != null) {
        firebase.firestore().collection('members').doc(user.uid).update({
          Token : this.token
        })
        this.router.navigateByUrl("/tabs");
        console.log('logged in');
      // }
      unsubscribe();
      })
      }
        });
      } else {
        this.router.navigateByUrl("onboarding");
      }
    }, err => {
      console.log('component error ', err);
      
      this.router.navigateByUrl("/tabs");
      // this.router.navigateByUrl("onboarding");
    })
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

