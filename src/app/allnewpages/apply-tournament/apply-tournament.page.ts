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
  storageKeys = []
  db = firebase.firestore()
  applytournaments = []
  teamState = false
  userObj = {}
  vendorObj = {}
  appliedForTourn = false
  profile = {
    fullName: '',
    image: ''
  }
  role = ''
  constructor(public pass: PassInformationServiceService,
    public alertController: AlertController,
    public authService: AuthServiceService,
    public passService: PassInformationServiceService,
    public loadingController: LoadingController,
    public store: NativeStorage,
    public router: Router) { }
  async presentLoading() {
    const loading = await this.loadingController.create({

      duration: 2000,
      message: 'Please wait...',
      translucent: true,

    });
    return await loading.present();
  }

  ngOnInit() {
    this.checkForTournaments();
    //this.getUserProfile();
    this.geTeamProfile();
    this.getProfile();
    setTimeout(() => {
      console.log('blah bal', this.userObj);
    }, 1000);
    this.store.keys().then(res => {
      res.forEach(element => {
        this.storageKeys.push(element);
      });
      console.log(this.storageKeys);

    })

  }
  ionViewWillLeave() {
    this.storageKeys.forEach(element => {
      this.store.remove(element).then((res) => {
        this.store.setItem(element, 'read').then(res => {
          console.log(element, 'updated ');

        })
      }).catch(err => {
        console.log('no key to delete');

      })

    });
  }
  back() {
    this.router.navigateByUrl('home')
  }
  async presentTeamCreateAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'No team Found',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async applyForTournament(value) {
    console.log('item', value)
    if (!this.userObj && this.passService.role == 'teamManager') {
      console.log('you dont have a team');
      const alert = await this.alertController.create({
        header: 'No Players/Team',
        message: 'No Team/Player information found, please add Team/Players.',
        buttons: [{
          text: 'Manage Team',
          handler: () => {
            this.router.navigate(['manage-team'])
          }
        }, {
          text: 'Not Now',
          role: 'cancel'
        }]
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Apply for ' + value.doc.formInfo.tournamentName,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Apply',
            handler: () => {
              let r = Math.random().toString(36).substring(7).toUpperCase();
              let some = r
              if (this.role == 'vendor') {
                this.db.collection('newTournaments').doc(value.docid).collection('vendorApplications').doc(firebase.auth().currentUser.uid).set({
                 vendorobject :  this.vendorObj,
                  refNumber: r,
                  status: 'awaiting'
                }).then(res => {
                  this.presentLoading();
                  this.checkForTournaments();
                  console.log('lets see', value.doc.formInfo.tournamentName, some);
                })
              } else
                this.db.collection('newTournaments').doc(value.docid).collection('teamApplications').doc(firebase.auth().currentUser.uid).set({
                  TeamObject: this.userObj,
                  refNumber: r,
                  status: 'awaiting'
                }).then(res => {
                  this.presentLoading();
                  this.checkForTournaments();
                  console.log('lets see', value.doc.formInfo.tournamentName, some);

                })
              console.log('Confirm Okay');
            }
          }
        ]
      });
      await alert.present();
    }
  }
  checkForTournaments() {
    let obj = {
      docid: null,
      doc: null,
      isApplied: false,
      application: null
    }
    this.db.collection('newTournaments').where('approved', '==', true).get().then(res => {
      if (!res.empty) {
        this.applytournaments = []
        res.forEach(document => {
          console.log('data', document.data());
          console.log('res', this.applytournaments);

          if (this.passService.role == 'vendor') {
            this.db.collection('newTournaments').doc(document.id).collection('vendorApplications').doc(firebase.auth().currentUser.uid).get().then(res => {
              console.log('applied tournaments', res.data());
              if (res.exists) {
                obj = {
                  docid: document.id,
                  doc: document.data(),
                  isApplied: true,
                  application: res.data()
                }
                this.applytournaments.push(obj)
              } else {
                obj = {
                  docid: document.id,
                  doc: document.data(),
                  isApplied: false,
                  application: res.data()
                }
                this.applytournaments.push(obj)
              }
            })
          } else if (this.passService.role == 'teamManager') {
            this.db.collection('newTournaments').doc(document.id).collection('teamApplications').doc(firebase.auth().currentUser.uid).get().then(res => {
              console.log('applied tournaments', res.data());
              
              if (res.exists) {
                obj = {
                  docid: document.id,
                  doc: document.data(),
                  isApplied: true,
                  application: res.data()
                }
                this.applytournaments.push(obj)
              } else {
                obj = {
                  docid: document.id,
                  doc: document.data(),
                  isApplied: false,
                  application: res.data()
                }
                this.applytournaments.push(obj)
                console.log('arrat', obj);
                
              }

            })
//             this.db.collection('newTournaments').doc(document.id).collection('teamApplications').doc(firebase.auth().currentUser.uid).onSnapshot(res => {
// // this.applyForTournament = []
//      if(res.exists){
//        console.log('my document', res.data().status);
//        if(res.data().status == 'paid'){

//         this.applytournaments.pop
//          console.log('its done');
         
//        }
//      }
//             })
          }
        })
      }
    })
  }
  geTeamProfile() {
    this.db.collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').get().then(res => {
      console.log(res);

      if (res.size > 0) {
        this.db.collection('Teams').doc(firebase.auth().currentUser.uid).get().then(res => {
          this.userObj = res.data()
        })
        this.teamState = true
        console.log('got team', res);

      } else {
        this.teamState = false
        console.log('no team');

      }
    })
  }
  getProfile() {
    firebase.firestore().collection('members').doc(firebase.auth().currentUser.uid).get().then(res => {
      this.vendorObj = res.data()
      console.log('vendor',this.vendorObj);
      
      this.profile.fullName = res.data().form.fullName;
      if (res.data().form.role == 'vendor') {
        this.role = 'vendor';
      } else {
        this.role = 'teamManager';
      }
    })
  }
  routerToProfile(){
    this.router.navigateByUrl('profile')
  }

}
