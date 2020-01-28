import { Component, OnInit, NgZone, Renderer2, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import { PassInformationServiceService } from '../service/pass-information-service.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  role = 'user'
  object: {
    o: {
      b: {
        yarn
      }
    }
  }
  status
  tabElement = document.getElementsByTagName('ion-tab-bar');
  activePage = 'home'
  constructor(public ngZone: NgZone, public passService: PassInformationServiceService,public renderer: Renderer2) { }

  ngOnInit() {
    this.ngZone.run(() => {
      firebase.auth().onAuthStateChanged(res => {
        if (res) {
          this.role = this.passService.role;
          
          
          firebase.firestore().collection('members').doc(res.uid).get().then(snap => {
            if (snap.exists) {
              this.role = snap.data().form.role
              console.log(snap.data() );
              
              
              this.status = snap.data().status
            }

          })
        } else {
          this.role = 'user';

        }
      })
    })
  }
  active(page) {
    this.activePage = page;
  }
  hideTabs(cmd) {
    switch (cmd) {
      case 'login':
      this.renderer.setStyle(this.tabElement[0],'transform','translateY(10vh)')
        break;
      case 'register':
        this.renderer.setStyle(this.tabElement[0],'transform','translateY(10vh)')
        break;
      default:
        this.renderer.setStyle(this.tabElement[0],'transform','translateY(0vh)')
        break;
    }
  }
  onScroll(ev) {
    console.log(ev);
    
  }
}
