import { NavController } from '@ionic/angular';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as firebase from 'firebase'
@Component({
  selector: 'app-view-match',
  templateUrl: './view-match.page.html',
  styleUrls: ['./view-match.page.scss'],
})
export class ViewMatchPage implements OnInit {
  segmentVal = 'lineup'
  arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  viewPlayer = false;
  playerDetailsDiv = document.getElementsByClassName('playerInfo')
  viewTeam = false;
  teamDetailsDiv = document.getElementsByClassName('teamInfo')
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>BACK END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  viewingMatch = null
  db = firebase.firestore()
  match
  tournament
  constructor(public navCtrl: NavController, private route: ActivatedRoute, private router: Router,public renderer: Renderer2) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.match = this.router.getCurrentNavigation().extras.state.parms
        this.tournament = this.router.getCurrentNavigation().extras.state.tournament
        //tournament
        console.log(this.tournament);


      }
    });
  }
  segmentChanged(ev) {
    console.log(ev.detail.value)
  }
  goBack() {
    let navigationExtras: NavigationExtras = {
      state: {
        parms: this.tournament,

      }
    };
    this.navCtrl.navigateBack('view-tournament', navigationExtras)
  }
  player(side, state) {
    switch (state) {
      case 'open':
        if (side=='home') {
          this.viewPlayer = true;
          this.renderer.setStyle(this.playerDetailsDiv[0],'display','flex')
        } else {
          this.viewPlayer = true;
          this.renderer.setStyle(this.playerDetailsDiv[0],'display','flex')
          
        }
        break;
      case 'close':
        if (side=='home') {
          this.viewPlayer = false;
          setTimeout(() => {
            this.renderer.setStyle(this.playerDetailsDiv[0],'display','none')
          }, 500);
        } else {
          this.viewPlayer = false;
          setTimeout(() => {
            this.renderer.setStyle(this.playerDetailsDiv[0],'display','none')
          }, 500);
        }
        break;
    }
  }
  team(side, state) {
    switch (state) {
      case 'open':
        if (side=='home') { 
          this.viewTeam = true;
          this.renderer.setStyle(this.teamDetailsDiv[0],'display','flex')
        } else {
          this.viewTeam = true;
          this.renderer.setStyle(this.teamDetailsDiv[0],'display','flex')
        }
        break;
      case 'close':
        if (side=='home') {
          this.viewTeam = false;
          setTimeout(() => {
            this.renderer.setStyle(this.teamDetailsDiv[0],'display','none')
          }, 500);
        } else {
          this.viewTeam = false;
          setTimeout(() => {
            this.renderer.setStyle(this.teamDetailsDiv[0],'display','none')
          }, 500);
        }
        break;
    }
  }
}
