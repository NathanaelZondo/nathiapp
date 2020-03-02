import { Component, NgZone } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { PassInformationServiceService } from './service/pass-information-service.service';
import * as firebase from 'firebase';
import { config } from './firebaseConfig'
import { FCM } from '@ionic-native/fcm/ngx';
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  role
  //  profile = {} as Profile 
  token = null
  o

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private pass: PassInformationServiceService,
    public ngZone: NgZone,
    private alertCtrl: AlertController,
    private fcm: FCM,
    private nativeStorage: NativeStorage,
    public alertController: AlertController,
    private network: Network
  ) {

    this.initializeApp();
    this.ngZone.run(() => {
      this.fcm.getToken().then(token => {
        this.token = token
        console.log('token', token);
        firebase.firestore().collection('testToken').add({
          token: token,
          timeStamp: new Date
        })
      });
      this.runProcesses()
      // this.checkForTeamAndPlayers();
    })
  }
  runProcesses() {
    this.ngZone.run(() => {
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        this.router.navigateByUrl('no-network')
      }, err => {
        console.log(err);

      });
      disconnectSubscription.unsubscribe()

      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {
        console.log('network connected!');

        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          this.router.navigateByUrl('tabs')
          if (this.network.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!', this.network.type);
          }
        }, 3000);
      }, err => {
        console.log(err);

      });
      connectSubscription.unsubscribe()

      // check for the onboarding property
      this.nativeStorage.getItem('doneOnboarding').then(res => {

        // IF THE RESPONSE IS TRUE
        if (res == true) {

          // CHECK IF THE USER IS LOGGED IN
          const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (!user) {

              // GO HOME IF THERE'S NO USER
              this.router.navigateByUrl("/tabs");
              unsubscribe();
            } else {

              // GET THE PROFILE OF THE LOGGED IN USER TO CHECK WHAT ROLE THEY LOGGED IN AS
              firebase.firestore().collection('members').doc(user.uid).get().then(res => {

                // IF THEY ARE TEAM MANAGER
                if(res.data().form.role=='teamManager') {
                    // if (user) {

                    // CHECK IF THEY HAVE A TEAM
                      firebase.firestore().collection('Teams').doc(user.uid).get().then(res => {

                        // CHECK IF THE TEAM HAS PLAERS
                        firebase.firestore().collection('Teams').doc(user.uid).collection('Players').get().then(players => {

                          // IF THE TEAM DOES NOT EXIST, GO TO ADD TEAM
                          if (!res.exists) {
                            this.router.navigateByUrl("/add-team")
                            this.presentAlert()

                            // IF IT EXISTS BUT HAS NO PLAYERS, GO TO ADD PLAYER
                          } else if (res.exists && players.empty == true) {
                            console.log('no player');
    
                            this.router.navigateByUrl("/add-player");
                            this.presentAlert1()

                            // ELSE GO TO TABS, THEY HAVE EVERYTHING
                          } else {
                            unsubscribe();
                            this.router.navigateByUrl("/tabs")
                          }
                        })
                      })
                    // } else {
                    //   this.router.navigateByUrl("/tabs")
                    // }
                  
                // IF THEY ARE VENDOR, GO HOME, THEY HAVE A PROFILE BY DEFAULT THAT'S ALL WE NEED
                } else {
                  unsubscribe();
                  this.router.navigateByUrl("/tabs");
                }
              })

              firebase.firestore().collection('members').doc(user.uid).update({
                Token: this.token
              })

              

            }
          });
        } else {
          this.router.navigateByUrl("onboarding");
        }
      }, err => {
        console.log('component error ', err);
        // 
        // this.router.navigateByUrl("/tabs");
        // GO TO THE ONBOARDING IF THERE IS NO PROPERTY
        this.router.navigateByUrl("onboarding");
      })
    })
  }
  checkForTeamAndPlayers() {
    // CHECK THE LOGIN STATE OF THE USER
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {

        // GO HOME IF THERE'S NO USER
        this.router.navigateByUrl("/tabs");
 
      } else {

        // GET THE PROFILE OF THE LOGGED IN USER TO CHECK WHAT ROLE THEY LOGGED IN AS
        firebase.firestore().collection('members').doc(user.uid).get().then(res => {

          // IF THEY ARE TEAM MANAGER
          if(res.data().form.role=='teamManager') {
              // if (user) {

              // CHECK IF THEY HAVE A TEAM
                firebase.firestore().collection('Teams').doc(user.uid).get().then(res => {

                  // CHECK IF THE TEAM HAS PLAERS
                  firebase.firestore().collection('Teams').doc(user.uid).collection('Players').get().then(players => {

                    // IF THE TEAM DOES NOT EXIST, GO TO ADD TEAM
                    if (!res.exists) {
                      this.router.navigateByUrl("/add-team")
                      this.presentAlert()

                      // IF IT EXISTS BUT HAS NO PLAYERS, GO TO ADD PLAYER
                    } else if (res.exists && players.empty == true) {
                      console.log('no player');

                      this.router.navigateByUrl("/add-player");
                      this.presentAlert1()

                      // ELSE GO TO TABS, THEY HAVE EVERYTHING
                    } else {
                      this.router.navigateByUrl("/tabs")
                    }
                  })
                })
              // } else {
              //   this.router.navigateByUrl("/tabs")
              // }
            
          // IF THEY ARE VENDOR, GO HOME, THEY HAVE A PROFILE BY DEFAULT THAT'S ALL WE NEED
          } else {
            this.router.navigateByUrl("/tabs");
          }
        })

        firebase.firestore().collection('members').doc(user.uid).update({
          Token: this.token
        })
      }
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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'No Team found',
      message: 'In order for you to be able to apply for tournaments, you must add your team details',
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentAlert1() {
    const alert = await this.alertController.create({
      header: 'No Players found',
      message: 'In order for you to be able to apply for tournaments, you must add your team players',
      buttons: ['OK']
    });

    await alert.present();
  }
}

