import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import * as firebase from 'firebase'
import { PassInformationServiceService } from 'src/app/service/pass-information-service.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Component({
  selector: 'app-view-tournament',
  templateUrl: './view-tournament.page.html',
  styleUrls: ['./view-tournament.page.scss'],
})
export class ViewTournamentPage implements OnInit {
  viewedTournament = null
  tournMatches = []
  tempArray = []
  participants = []
  segmentValue = '16'
  match = {
    type1: [],// 1
    type2: [],// 2
    type4: [], // 8
    type8: [], // 16
    type16: [], // 32
    winner: {} as any
  }
  db = firebase.firestore()
  filterBy = null

  storageKeys = []
  applytournaments = 'checking'
  teamState = false
  userObj = {}
  vendorObj = {}
  profile = {
    fullName: '',
    image: ''
  }
  role = 'user'
  userProfile = false
  loggedInUser = null
  constructor(public pass: PassInformationServiceService, public navCtrl: NavController, private activatedRoute: ActivatedRoute, private router: Router, public loadingController: LoadingController, public store: NativeStorage, public passService: PassInformationServiceService, public alertController: AlertController, public renderer: Renderer2) { }
  tournid;
  ngOnInit() {
    this.tournMatches = []
    // receives nav params
    firebase.auth().onAuthStateChanged(user => {
if (user) {
  firebase.auth().updateCurrentUser(user).then(res => {
    this.loggedInUser = user
    setTimeout(() => {
      this.checkForTournaments();
    }, 1000);
    //this.getUserProfile();
    this.geTeamProfile();
    this.getProfile();
    this.checkProfile()
    setTimeout(() => {
      console.log('blah bal', this.userObj);
    }, 1000);
    this.store.keys().then(res => {
      res.forEach(element => {
        this.storageKeys.push(element);
      });
      console.log(this.storageKeys);

    })
  })
} else {
  this.applytournaments = 'no'
}
    })


    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.viewedTournament = this.router.getCurrentNavigation().extras.state.parms
        console.log(this.viewedTournament);
        this.pass.tournid = this.viewedTournament.doc_id;
        this.tournid = this.viewedTournament.doc_id;
        if (this.viewedTournament.state == 'finished') {
          // finnished matches
          this.db.collection('PlayedMatches').where('tournid', '==', this.viewedTournament.doc_id).orderBy("matchdate", "desc").get().then(res => {

            this.tournMatches = []
            this.match = {
              type1: [],// 1
              type2: [],// 2
              type4: [], // 8
              type8: [], // 16
              type16: [], // 32
              winner: {}
            }
            res.forEach(doc => {
              this.tempArray.push(doc.data())
              // CHECK WICH MATCH TYPE IS WHICH AND PUSH IT INTO THE RESPECTIVE ARRAY
              if (doc.data().type == '16') { // 32
                this.match.type16.push(doc.data())
              } else if (doc.data().type == '8') { // 16
                this.match.type8.push(doc.data())
              } else if (doc.data().type == '4') { // 8
                this.match.type4.push(doc.data())
              } else if (doc.data().type == '2') { // 4
                this.match.type2.push(doc.data())
              } else if (doc.data().type == '1') { // 2
                this.match.type1.push(doc.data())
                if (doc.data().score >= 1) {
                  this.match.winner = doc.data().TeamObject
                } else {
                  this.match.winner = doc.data().aTeamObject
                }
              }
            })
            this.getPlayedMatches()
            this.checkMatches()
            console.log(this.match);

          }).catch(err => { console.log(err); })
        } else {
          // these are upcoming ur inplay matches
          this.db.collection('MatchFixtures').where('tournid', '==', this.viewedTournament.doc_id).orderBy("matchdate", "desc").get().then(res => {

            this.tournMatches = []
            this.match = {
              type1: [],// 1
              type2: [],// 2
              type4: [], // 8
              type8: [], // 16
              type16: [], // 32
              winner: {}
            }
            res.forEach(doc => {
              if (doc.data().type == '16') {
                this.match.type16.push(doc.data())

              } else if (doc.data().type == '8') {
                this.match.type8.push(doc.data())

              } else if (doc.data().type == '4') {
                this.match.type4.push(doc.data())

              } else if (doc.data().type == '2') {
                this.match.type2.push(doc.data())
              } else if (doc.data().type == '1') {
                this.match.type1.push(doc.data())
                if (doc.data().score >= 1) {
                  this.match.winner = doc.data().TeamObject
                } else {
                  this.match.winner = doc.data().aTeamObject
                }
              }
            })
            this.checkMatches()
            console.log(this.match);

          }).catch(err => {
            console.log(err);

          })
        }
      }
    });
  }
  getPlayedMatches() {
    // let obj = {
    //   data : {},
    //   id : ''
    // } 
    this.db.collection('PlayedMatches').where('tournid', '==', this.viewedTournament.doc_id).orderBy("matchdate", "desc").get().then(res => {
      res.forEach(doc => {
        this.tempArray.push(doc.data())

        // CHECK WICH MATCH TYPE IS WHICH AND PUSH IT INTO THE RESPECTIVE ARRAY
        if (doc.data().type == '16') { // 32
          this.match.type16.push(doc.data())
        } else if (doc.data().type == '8') { // 16
          this.match.type8.push(doc.data())
        } else if (doc.data().type == '4') { // 8
          this.match.type4.push(doc.data())
        } else if (doc.data().type == '2') { // 4
          this.match.type2.push(doc.data())
        } else if (doc.data().type == '1') { // 2
          this.match.type1.push(doc.data())
          if (doc.data().score >= 1) {
            this.match.winner = doc.data().TeamObject
          } else {
            this.match.winner = doc.data().aTeamObject
          }
        }
      })
      console.log(this.match);
    }).catch(err => { console.log(err); })
  }
  ionViewWillLeave() {
    this.tournMatches = []
    this.applytournaments = 'checking'
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
  checkProfile() {
    this.db.collection('members').doc(this.loggedInUser.uid).onSnapshot(res => {
      if (res.data().status == 'awaiting') {
        console.log('no profile');

      } else {
        this.userProfile = true
      }
    })
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

  async applyForTournament() {
    if (this.teamState == false && this.role == 'teamManager') {
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
        header: 'Apply for ' + this.viewedTournament.formInfo.tournamentName + '?',
        message: 'This tournament costs <b>R' + this.viewedTournament.formInfo.joiningFee + '.00</b> to participate in <br> <hr> Proceed?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.presentLoading('p', false);
              let r = Math.random().toString(36).substring(7).toUpperCase();
              let some = r
              if (this.role == 'vendor') {
                this.db.collection('newTournaments').doc(this.viewedTournament.doc_id).collection('vendorApplications').doc(this.loggedInUser.uid).set({
                  vendorobject: this.vendorObj,
                  refNumber: r,
                  status: 'awaiting',
                  TournamentID: this.viewedTournament.doc_id,
                  uid: this.loggedInUser.uid
                }).then(res => {
                  this.db.collection('newTournaments').doc(this.viewedTournament.doc_id).update({
                    vendorTotalApplications: firebase.firestore.FieldValue.increment(1)
                  }).then(r => {
                    this.presentLoading('d', true);
                  })

                  console.log('lets see', this.viewedTournament.formInfo.tournamentName, some);
                }).catch(err => {
                  this.presentLoading('d', false);
                })
              } else if (this.teamState == true) {
                this.db.collection('newTournaments').doc(this.viewedTournament.doc_id).collection('teamApplications').doc(this.loggedInUser.uid).set({
                  TeamObject: this.userObj,
                  refNumber: r,
                  status: 'awaiting',
                  clientNotified: 1,
                  TournamentID: this.viewedTournament.doc_id
                }).then(res => {
                  this.db.collection('newTournaments').doc(this.viewedTournament.doc_id).update({
                    totalApplications: firebase.firestore.FieldValue.increment(1)
                  }).then(r => {
                    console.log('should dismiss');

                    this.presentLoading('d', true);
                  }).catch(err => {
                    this.presentLoading('d', false);
                  })
                  console.log('lets see', this.viewedTournament.formInfo.tournamentName, some);

                }).catch(err => {
                  this.presentLoading('d', false);
                })
              }

            }
          },
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
          }
        ]
      });
      await alert.present();
    }
  }
  checkForTournaments() {
    console.log(this.applytournaments);

    this.applytournaments = 'checking'
    console.log(this.applytournaments);


    if (this.role == 'teamManager') {
      this.db.collection('newTournaments').doc(this.viewedTournament.doc_id).collection('teamApplications').doc(this.loggedInUser.uid).get().then(res => {
        console.log(res);

        if (res.exists) {
          setTimeout(() => {
            this.applytournaments = 'yes'
          }, 1000);
        } else {
          setTimeout(() => {
            this.applytournaments = 'no'
          }, 1000);
        }
      })
    } else {
      this.db.collection('newTournaments').doc(this.viewedTournament.doc_id).collection('vendorApplications').doc(this.loggedInUser.uid).get().then(res => {
        if (res.exists) {
          this.applytournaments = 'yes'
        } else {
          this.applytournaments = 'no'
        }
      })
    }

  }
  geTeamProfile() {
    this.db.collection('Teams').doc(this.loggedInUser.uid).onSnapshot(res => {
      console.log(res);
      if (res.exists) {
        console.log('team  exist');
        this.db.collection('Teams').doc(this.loggedInUser.uid).collection('Players').onSnapshot(doc => {
          if (doc.size > 0) {
            this.userObj = res.data();
            this.teamState = true
            console.log('team PLAYERS exist');
          }
        })

      } else {
        this.teamState = false
        console.log('no team exist');

      }

    })
  }
  getProfile() {
    firebase.firestore().collection('members').doc(this.loggedInUser.uid).onSnapshot(res => {
if(res.exists) {
  this.vendorObj = res.data()
  console.log('vendor', this.vendorObj);

  this.profile.fullName = res.data().form.fullName;
  if (res.data().form.role == 'vendor') {
    this.role = 'vendor';
  } else {
    this.role = 'teamManager';
  }
} else {
    this.role = 'user'
    this.applytournaments = 'no'
    console.log(this.applytournaments, ' 373');
    
  }
    })
  }
  //  generates images for the participants section
  generateParticipants(type) {

    switch (type) {
      case '32':
        console.log('case 8');

        for (let i = 0; i < this.match.type16.length; i++) {
          const homeTeam = this.match.type16[i].TeamObject;
          const awayTeam = this.match.type16[i].aTeamObject;

          this.participants.push(homeTeam)
          this.participants.push(awayTeam)
        }
        break;
      case '16':
        console.log('case 8');

        for (let i = 0; i < this.match.type8.length; i++) {
          const homeTeam = this.match.type8[i].TeamObject;
          const awayTeam = this.match.type8[i].aTeamObject;

          this.participants.push(homeTeam)
          this.participants.push(awayTeam)
        }
        break;
      case '8':
        console.log('case 8');

        for (let i = 0; i < this.match.type4.length; i++) {
          const homeTeam = this.match.type4[i].TeamObject;
          const awayTeam = this.match.type4[i].aTeamObject;

          this.participants.push(homeTeam)
          this.participants.push(awayTeam)
        }

        break;
      case '4':
        console.log('case 8');

        for (let i = 0; i < this.match.type2.length; i++) {
          const homeTeam = this.match.type2[i].TeamObject;
          const awayTeam = this.match.type2[i].aTeamObject;

          this.participants.push(homeTeam)
          this.participants.push(awayTeam)
        }

        break;
      case '2':
        console.log('case 8');

        for (let i = 0; i < this.match.type1.length; i++) {
          const homeTeam = this.match.type1[i].TeamObject;
          const awayTeam = this.match.type1[i].aTeamObject;

          this.participants.push(homeTeam)
          this.participants.push(awayTeam)
        }

        break;

    }
  }
  checkMatches() {
    if (this.match.type16.length > 0) {
      this.tournMatches = this.match.type16
      this.filterBy = 'top32'
      console.log('filter by top32');
    } else if (this.match.type8.length > 0) {
      this.tournMatches = this.match.type8
      this.filterBy = 'top16'
      console.log('filter by top16');
    } else if (this.match.type4.length > 0) {
      this.tournMatches = this.match.type4
      this.filterBy = 'top8'
      console.log('filter by top8');
      this.generateParticipants('8')
    } else if (this.match.type2.length > 0) {
      this.tournMatches = this.match.type2
      this.filterBy = 'top4'
      console.log('filter by top4');
      this.generateParticipants('4')
    } else if (this.match.type1.length > 0) {
      this.tournMatches = this.match.type1
      this.filterBy = 'top1'
      this.generateParticipants('1')
    } else {
      this.filterBy = 'nothing'
    }
  }
  goBack() {
    this.router.navigate(['tabs'])
    this.applytournaments = 'checking'
    this.viewedTournament = null
    this.participants = []
  }
  segmentChanged(ev) {
    this.filterBy = ev
    let event = ev;
    console.log(ev);

    switch (event) {
      case 'top32':
        this.tournMatches = this.match.type16
        break;
      case 'top16':
        this.tournMatches = this.match.type8
        break;
      case 'top8':
        this.tournMatches = this.match.type4
        break;
      case 'top4':
        this.tournMatches = this.match.type2
        break;
      case 'top1':
        this.tournMatches = this.match.type1
        break;
    }
  }
  viewMatch(match) {

    console.log(match)

    this.pass.matchdetails(match);

    let navigationExtras: NavigationExtras = {
      state: {
        parms: match,
        tournament: this.viewedTournament
      }
    };
    // passes nav params
    this.router.navigate(['view-match'],navigationExtras);
  }
  async presentLoading(cmd, state) {
    let loader = await this.loadingController.create({
      message: 'Just a moment',
      backdropDismiss: false
    });

    switch (cmd) {
      case 'p':
        await loader.present().then(() => {
          console.log('loader presented', loader);
        })
        break;
      case 'd':
        console.log('d called');

        if (state) {
          this.applytournaments = 'checking'
          this.applytournaments = 'yes'
          let success = await this.alertController.create({
            header: 'Success',
            message: 'Your applications needs to be approved. Once approved, Please check your email for further instructions of this process.',
            buttons: [
              {
                text: 'Okay',
                role: 'cancel'
              }
            ]
          })

          success.present()
        } else {
          let error = await this.alertController.create({
            header: 'Oops!',
            message: "It's not serious, but you probably will need to apply again at a later stage. Sorry for the inconvenience.",
            buttons: [
              {
                text: 'Okay',
                role: 'cancel'
              }
            ]
          })
          error.present()
        }
        // the dismiss doesnt work somehow so i used renderer to remove the loader from view
        return await loader.dismiss().then(() => {
          let ionLoader = document.getElementsByTagName('ion-loading')
          console.log(ionLoader);
          for (let i = 0; i < ionLoader.length; i++) {
            this.renderer.setStyle(ionLoader[i],'display','none');
            
          }
          // was trying to find why is wasnt dismissing
        }).catch(err => {
          let ionLoader = document.getElementsByTagName('ion-loading')
          console.log(ionLoader);
          for (let i = 0; i < ionLoader.length; i++) {
            this.renderer.setStyle(ionLoader[i],'display','none');
            
          }
        })
        break;
    }
  }
}
