import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, AlertController } from '@ionic/angular';
import { menuController } from '@ionic/core';
import { MenuComponent } from '../components/menu/menu.component';
import * as firebase from 'firebase';
import { PassInformationServiceService } from '../service/pass-information-service.service';
import { AuthServiceService } from '../service/auth-service.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NavigationExtras } from '@angular/router';
import { element } from 'protractor';
import * as moment from 'moment'
// import {moment} from 
// import { FCM } from '@ionic-native/fcm/ngx';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  popover1;
  db = firebase.firestore()
  role
  user
  token
  skeleton = [1]
  viewTournaments = []
  tourn = {
    inprogres: [],
    upcoming: [],
    finished: []
  }
  accountRole = 'user'
  filterBy = 'inProgress'
  loadFilter = false;

  constructor(public router: Router,
    public popoverController: PopoverController,
    public pass: PassInformationServiceService,
    public auth: AuthServiceService,
    public splashScreen: SplashScreen,
    // private oneSignal: OneSignal,
    public alertController: AlertController,
    public ngZone: NgZone) {
    this.tourn.upcoming = [];

    // this.router.navigate(['tournament']);
    // console.log('uid',firebase.auth().currentUser.uid);
    // this.getUserProfile()
    // this.user = firebase.auth().currentUser.uid

    firebase.firestore().collection('newTournaments').where("state", '==', 'newTournament').onSnapshot(res => {
      this.tourn.upcoming = []
      res.forEach(val => {

        if (val.data().approved == true) {
          console.log("here", this.tourn.upcoming)
          this.tourn.upcoming.push({ ...{ doc_id: val.id }, ...val.data() });

          if (this.tourn.upcoming.length == undefined) {
            this.tourn.upcoming = [];
          }
          else {
            // this.upcoming.push({ ...{ doc_id: val.id }, ...val.data() });
          }
        }
      })
    })


    firebase.firestore().collection('newTournaments').where("state", '==', 'inprogress').onSnapshot(res => {
      this.tourn.inprogres = []
      res.forEach(val => {
        this.tourn.inprogres.push({ ...{ doc_id: val.id }, ...val.data() });
        console.log("inprog", this.tourn.inprogres)
      })
      if (this.tourn.inprogres.length > 0) {
        this.skeleton = []
        this.viewTournaments = this.tourn.inprogres
      }
    })


    firebase.firestore().collection('newTournaments').where("state", '==', 'finished').onSnapshot(res => {
      this.tourn.finished = []
      res.forEach(val => {
        this.tourn.finished.push({ ...{ doc_id: val.id }, ...val.data() });
        console.log("here")
      })
    })
  }
  async popover() {
    this.popover1 = await this.popoverController.create({
      component: MenuComponent,
      translucent: true
    });
    return await this.popover1.present();

  }

  ionViewWillLeave() {
    console.log('will leave');

    if (this.popover1) {
      this.popover1.dismiss();
    }
  }
  // check() {

  //   this.presentAlertCheckbox()

  // }
  ngOnInit() {
    let t = new Date('22/02/2020')
    let s = moment([2020, 2, 22]).fromNow();
    console.log('izesha', s);

    let today = new Date();
    // let timeToday = new 
    let date = new Date();
    console.log('date', date);

    this.ngZone.run(() => {
      // this.check()
      this.getMatchFixtures()
      // this.presentAlertCheckbox();
      this.auth.setUser(this.user);
      // this.getUserProfile();
      this.getUser();
    })
    // this.getToken();
    setTimeout(() => {
      console.log('home', this.pass.role);
    }, 500);
    setTimeout(() => {
      this.splashScreen.hide()
    }, 3000);
  }
  addTeam() {
    this.router.navigateByUrl('add-team');
  }
  getUser() {
    this.ngZone.run(() => {

      firebase.auth().onAuthStateChanged(state => {

        if (state) {
          this.db.collection('members').doc(state.uid).onSnapshot(res => {
            console.log(res);

            if (res.exists) {
              console.log(res.data());

              this.pass.role = res.data().form.role;
              this.accountRole = res.data().form.role;
            }
          });
        } else {
          this.accountRole = 'user'
        }
      })
    })
  }
  viewTournament(tournament) {
    console.log(tournament);
    let navigationExtras: NavigationExtras = {
      state: {
        parms: tournament
      }
    };
    // passes nav params
    this.router.navigate(['view-tournament'], navigationExtras);
  }
  filter(by) {
    if (this.filterBy != by) {
      this.loadFilter = true
      this.filterBy = by
      console.log(this.filterBy);

      switch (by) {
        case 'comingUp':

          setTimeout(() => {
            this.viewTournaments = this.tourn.upcoming

            this.loadFilter = false
            if (this.tourn.upcoming.length == 0) {
              this.skeleton = [1]
            } else {
              this.skeleton = []
            }
          }, 100);
          break;
        case 'inProgress':

          setTimeout(() => {
            this.viewTournaments = this.tourn.inprogres

            this.loadFilter = false
            if (this.tourn.inprogres.length == 0) {
              this.skeleton = [1]
            } else {
              this.skeleton = []
            }
          }, 100);
          break;
        case 'results':

          setTimeout(() => {
            this.viewTournaments = this.tourn.finished

            this.loadFilter = false
            if (this.tourn.finished.length == 0) {
              this.skeleton = [1]
            } else {
              this.skeleton = []
            }
          }, 100);
          break;
      }
    }
  }
  login() {
    this.router.navigate(['login'])
  }
  getMatchFixtures() {
    firebase.firestore().collection('MatchFixtures').get().then(res => {
      let date = new Date();
      res.forEach(doc => {
        if (firebase.auth().currentUser.uid == doc.data().TeamObject.uid && date == doc.data().matchdate) {
          console.log('yes');
          // this.presentAlertCheckbox()

        } else if (firebase.auth().currentUser.uid == doc.data().aTeamObject.uid && date == doc.data().matchdate) {
          // this.presentAlertCheckbox()
        }
        // console.log('data',doc.data().TeamObject.uid);

      })
    })

  }



}
