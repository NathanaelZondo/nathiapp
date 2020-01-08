
import { Component, OnInit, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LoadingController } from '@ionic/angular';
import { PassInformationServiceService } from 'src/app/service/pass-information-service.service';

import {NativeStorage} from '@ionic-native/native-storage/ngx'
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  showextendedMenu = false
  showextendedMenu1 = false
  role = 'user'
  db = firebase.firestore()
  getUser
  user
  status
  firebaseTournaments = []
  unreadKeys = []
  constructor(private router: Router,
    private authservice: AuthServiceService,
    public loadingController: LoadingController,
    public passService: PassInformationServiceService,
    public auth: AuthServiceService,
    public store: NativeStorage,
    public ngZone: NgZone) {

    //       this.user = firebase.auth().currentUser.uid
    // this.auth.setUser(this.user);
    // this.getUserProfile();
    //   }
    //   getUserProfile() {
    //     this.db.collection('members').doc(this.authservice.getUser()).get().then(res => {
    //      this.role = res.data().role
    //       console.log('menu role',this.role);

    //     })
  }

  ngOnInit() {
    this.getNewTournaments()
    this.ngZone.run(() => {
      firebase.auth().onAuthStateChanged(res => {
        if (res) {
          this.role = this.passService.role;
          firebase.firestore().collection('members').doc(res.uid).get().then(snap => {
            if (snap.exists) {
              this.status = snap.data().status
            }

          })
        } else {
          this.role = 'user';

        }
      })
    })
  }

  // when we leave the page, update all the keys's values to read
   

  getExistingDocuments() {
    this.store.keys().then(res => {
      res.forEach(element => {
        this
      });
    })
  }
  getNewTournaments() {
    this.db.collection('newTournaments').where('state', '==', 'newTournament').onSnapshot(snap => {
      snap.forEach(doc => {
          // check if the document that comes from firebase exists in those keys
            // get existing keys
        this.store.getItem(doc.id).then(res => {
          if(res=='unread') {
            this.unreadKeys.push(doc.id);
            // if it does dont do anything
          } if (res=='read') {

          } else {
            // if it does not exist, put it in the storage with the value of unread
            this.store.setItem(doc.id, 'unread').then(res => {
          this.unreadKeys.push(doc.id)
        })
          }
        }).catch(err => {
          console.log('set key error', err);
          
        })
        
      })
      console.log('line 98',this.unreadKeys);
      
    })
  }
  profile() {
    if (this.status == 'awaiting') {
      this.router.navigateByUrl('errorpage')
    } else {
      this.router.navigateByUrl('profile');
    }

  }
  login() {
    this.router.navigateByUrl('login');
  }
  register() {
    this.router.navigateByUrl('registerpage');
    // this.router.navigateByUrl('manage-team');
  }
  manageteam() {
    if (this.status == 'awaiting') {
      this.router.navigateByUrl('errorpage')
    } else {
      this.router.navigateByUrl('manage-team');
    }

  }
  applyTournament() {
    if (this.status == 'awaiting') {
      this.router.navigateByUrl('errorpage')
    } else {
      this.router.navigateByUrl('apply-tournament');
    }

  }
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      // spinner: null,
      duration: 2000,
      message: 'Loading you out...',
    });
    return await loading.present();
  }
  signout() {
    firebase.auth().signOut().then(() => {
      this.presentLoadingWithOptions();
      this.router.navigateByUrl('home').catch(err => {

      })
    })
  }

}
export interface Profile {
  form: { name: string }
}