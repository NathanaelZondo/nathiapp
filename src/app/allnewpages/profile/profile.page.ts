import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import * as firebase from 'firebase'
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
  constructor(public router: Router) { }

  ngOnInit() {

    setTimeout(() => {
      this.db.collection('members').doc(firebase.auth().currentUser.uid).get().then(res => {
        this.profile.form.fullName = res.data().form.fullName
        this.profile.form.phoneNumber= res.data().form.phoneNumber
        this.profile.form.role= res.data().form.role
        this.profile.status= res.data().status
      })
    }, 500);
  }
  fitElementToParent(el, padding) {
    // window.addEventListener('resize');

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
              stroke: { value: ['rgba(255,75,75,1)', 'rgba(80,80,80,.35)'], duration: 500 },
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
}