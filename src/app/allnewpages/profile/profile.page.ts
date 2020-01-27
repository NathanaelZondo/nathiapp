import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import * as firebase from 'firebase'
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  db = firebase.firestore()
  listDiv = document.getElementsByClassName('tList')
  timeout = null;
  profile = {
    form: {
      fullName: null,
      phoneNumber: null,
      role: null
    },
    status: "awaitin"
  }
  tournaments = []
  participatingTourn = []
  loggedInUser = null
  constructor(public router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      firebase.auth().updateCurrentUser(user).then(() => {
        this.loggedInUser = user
        this.db.collection('members').doc(this.loggedInUser.uid).get().then(res => {
          console.log(res);
          this.profile.form.fullName = res.data().form.fullName
          this.profile.form.phoneNumber = res.data().form.phoneNumber
          this.profile.form.role = res.data().form.role
          this.profile.status = res.data().status
          console.log(res.data().form.role);

          if (res.data().form.role == 'teamManager') {
            this.getManagerTournaments()
          } else {
            this.getVendorTournaments()
          }
        })
      })
    })
  }
  fitElementToParent(el, padding) {
    if (this.timeout) clearTimeout(this.timeout);
    anime.set(el, { scale: 1 });
    var pad = padding || 0;
    var parentEl = document.getElementsByClassName('animation-wrapper');
    setTimeout(() => {
      var elOffsetWidth = el.offsetWidth - pad;
      var parentOffsetWidth = parentEl[0].clientWidth;
      var ratio = parentOffsetWidth / elOffsetWidth;
      this.timeout = setTimeout(anime.set(el, { scale: ratio }), 10);
    }, 500);
  }
  getManagerTournaments() {
    this.db.collection('newTournaments').get().then(res => {
      res.forEach(tourns => {
        this.db.collection('newTournaments').doc(tourns.id).collection('teamApplications').where('TeamObject.uid', '==', this.loggedInUser.uid).where('status', '==', 'paid').get().then(snap => {
          snap.forEach(doc => {
            if (doc.exists) {
              this.tournaments.push(tourns.data())
            }
          })
          console.log('lets see', this.tournaments);
        })
      })
    })
  }
  getVendorTournaments() {
    this.db.collection('newTournaments').get().then(res => {
      res.forEach(tourns => {
        this.db.collection('newTournaments').doc(tourns.id).collection('vendorApplications').where('TeamObject.uid', '==', this.loggedInUser.uid).get().then(snap => {
          snap.forEach(doc => {
            if (doc.exists) {
              this.tournaments.push(tourns.data())
            }
          })
          console.log(this.tournaments);
        })
      })
    })
  }
  sphereAnimation = (() => {

    var sphereEl = document.getElementsByClassName('sphere');
    var spherePathEls = sphereEl

    var hasStarted = false;
    var aimations = [];
    let sphereGradient = document.getElementsByClassName('sphereGradient')
    this.fitElementToParent(sphereEl, 10);
    setTimeout(() => {
      var pathLength = spherePathEls[0].childNodes.length;

      let breathAnimation = anime({
        begin: () => {
          for (var i = 0; i < pathLength; i++) {
            aimations.push(anime({
              targets: spherePathEls[0].childNodes[i],
              stroke: { value: ['rgb(5, 166, 107)', 'rgb(5, 166, 107)'], duration: 500 },
              translateX: [2, -4],
              translateY: [2, -4],
              easing: 'easeOutQuad',
              autoplay: false
            }));
          }
        },
        update: (ins) => {
          aimations.forEach((animation, i) => {
            var percent = (1 - Math.sin((i * .35) + (.0022 * ins.currentTime))) / 2;
            animation.seek(animation.duration * percent);
          });
        },
        duration: Infinity,
        autoplay: false
      });

      var introAnimation = anime.timeline({
        autoplay: false
      })
        .add({
          targets: sphereEl,
          strokeDashoffset: {
            value: [anime.setDashoffset, 0],
            duration: 3900,
            easing: 'easeInOutCirc',
            delay: anime.stagger(190, { direction: 'reverse' })
          },
          duration: 2000,
          delay: anime.stagger(60, { direction: 'reverse' }),
          easing: 'linear'
        }, 0);

      var shadowAnimation = anime({
        targets: '#sphereGradient',
        x1: '25%',
        x2: '25%',
        y1: '0%',
        y2: '75%',
        duration: 30000,
        easing: 'easeOutQuint',
        autoplay: false
      }, 0);

      introAnimation.play();
      breathAnimation.play();
      shadowAnimation.play();

    }, 500);


  })();
  back() {
    this.router.navigateByUrl('home')
  }
  async signout() {
    const alerter = await this.alertCtrl.create({
      header: 'Sign Out',
      message: "You're signing out, proceed?",
      buttons: [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          firebase.auth().signOut().then(() => {
            this.router.navigateByUrl('tabs/home').catch(err => {
            })
          }).catch(err => {
            console.log(err);
          })
        }
      }]
    })
    alerter.present()

  }

  //   getParticipatingTournaments(){
  // this.db.collection('newTournaments').where('approved','==','true').onSnapshot(res =>{
  //   this.participatingTourn = []
  //   res.forEach(doc =>{
  //     this.db.collection('newTournaments').doc(doc.id).collection('teamApplications').where('uid', '==', this.loggedInUser.uid).where('status','==','paid').onSnapshot(docx =>{

  //        if(docx.size>0) {
  //         this.participatingTourn.push(doc.data())
  //         console.log('details',this.participatingTourn);

  //        }
  //     })

  //   })
  // })
  //   }
}