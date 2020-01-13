import { NavController } from '@ionic/angular';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as firebase from 'firebase'
import { PassInformationServiceService } from 'src/app/service/pass-information-service.service';
@Component({
  selector: 'app-view-match',
  templateUrl: './view-match.page.html',
  styleUrls: ['./view-match.page.scss'],
})
export class ViewMatchPage implements OnInit {
  segmentVal = 'lineup'
  arr = []
  viewPlayer = false;
  playerDetailsDiv = document.getElementsByClassName('playerInfo')
  viewTeam = false;
  teamDetailsDiv = document.getElementsByClassName('teamInfo')
  viewStatistics = false;
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>BACK END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  viewingMatch = null

  // stores the player information
  playerViewed = {
    Achievements: null,
    DOB: null,
    DateCreated: {
      Timestamp: {}
    },
    DateEdited: null,
    fullName: null,
    height: null,
    palyerImage: null,
    playerNumber: null,
    playerPosition: null,
    previousTeam: null
  }

  // stores the team being viewed
  teamViewed = null

  db = firebase.firestore()
  match = [];
  tournament
  object: any = {};
  corner = 0;
  cornerstats = [];
  acorner = 0;
  acornerstats = [];
  red = 0;
  redstats = [];
  ared = 0;
  aredstats = []
  yellow = 0;
  yellowstats = [];
  ayellow = 0;
  ayellowstats = [];
  offside: number = 0;
  offsidestats = [];
  aoffside: number = 0;
  aoffsidestats = [];
  homeplayers = [];
  awayplayers = [];
  constructor(public pass: PassInformationServiceService, public navCtrl: NavController, private route: ActivatedRoute, private router: Router, public renderer: Renderer2) {
    this.homeplayers = [];
    this.awayplayers = [];
    this.match = this.pass.currentmatch;
    this.object = this.match[0];
    console.log("Match here = ", this.object);

    if (this.object.stats) {
      for (let r = 0; r < this.object.stats.length; r++) {

        // console.log("Match here = ",this.object.stats[r].offsides);
        if (this.object.stats[r].offsides != undefined) {

          this.offsidestats.push(this.object.stats[r]);
          this.offside = this.offsidestats.length;
          console.log("offsides", this.offsidestats, this.offside)
        }
        else if (this.object.stats[r].corners != undefined) {

          this.cornerstats.push(this.object.stats[r]);
          this.corner = this.offsidestats.length;
          console.log(this.cornerstats, this.corner)
        }
        else if (this.object.stats[r].yellow != undefined) {

          this.yellowstats.push(this.object.stats[r]);
          this.yellow = this.yellowstats.length;
          console.log(this.yellowstats, this.yellow)
        }

        else if (this.object.stats[r].red != undefined) {

          this.redstats.push(this.object.stats[r]);
          this.red = this.redstats.length;
          console.log(this.redstats, this.red)
        }









        if (this.object.stats[r].aoffsides != undefined) {

          this.aoffsidestats.push(this.object.stats[r]);
          this.aoffside = this.aoffsidestats.length;
          console.log("aoffsides", this.aoffsidestats, this.aoffside)
        }
        else if (this.object.stats[r].acorners != undefined) {

          this.acornerstats.push(this.object.stats[r]);
          this.acorner = this.aoffsidestats.length;
          console.log("acorner", this.acornerstats, this.acorner)
        }
        else if (this.object.stats[r].ayellow != undefined) {

          this.ayellowstats.push(this.object.stats[r]);
          this.ayellow = this.ayellowstats.length;

          console.log("yellow", this.ayellowstats, this.ayellow)
        }

        else if (this.object.stats[r].ared != undefined) {

          this.aredstats.push(this.object.stats[r]);
          this.ared = this.aredstats.length;
          console.log("ared", this.aredstats, this.ared)
        }

      }
    }

    firebase.firestore().collection('Teams').doc(this.object.TeamObject.uid).collection('Players').get().then(res => {
      res.forEach(val => {
        this.homeplayers.push(val.data())

      })
    })


    firebase.firestore().collection('Teams').doc(this.object.aTeamObject.uid).collection('Players').get().then(res => {
      res.forEach(val => {
        this.awayplayers.push(val.data())

      })
    })

  }

  // leave it alone
  viewStats(){this.viewStatistics=!this.viewStatistics}

  player(side, state, p) {
    console.log(p);
    if (p != null) {
      this.playerViewed = p
    } else {
      setTimeout(() => {
        this.playerViewed = {
          Achievements: null,
          DOB: null,
          DateCreated: {
            Timestamp: {}
          },
          DateEdited: null,
          fullName: null,
          height: null,
          palyerImage: null,
          playerNumber: null,
          playerPosition: null,
          previousTeam: null
        }
      }, 1000);
    }
    switch (state) {
      case 'open':
        if (side == 'home') {
          this.viewPlayer = true;
          this.renderer.setStyle(this.playerDetailsDiv[0], 'display', 'flex')
        } else {
          this.viewPlayer = true;
          this.renderer.setStyle(this.playerDetailsDiv[0], 'display', 'flex')

        }
        break;
      case 'close':
        if (side == 'home') {
          this.viewPlayer = false;
          setTimeout(() => {
            this.renderer.setStyle(this.playerDetailsDiv[0], 'display', 'none')
          }, 500);
        } else {
          this.viewPlayer = false;
          setTimeout(() => {
            this.renderer.setStyle(this.playerDetailsDiv[0], 'display', 'none')
          }, 500);
        }
        break;
    }
  }
  team(side, state) {
    switch (state) {
      case 'open':
        if (side == 'home') {
          this.viewTeam = true;
          this.renderer.setStyle(this.teamDetailsDiv[0], 'display', 'flex')
        } else {
          this.viewTeam = true;
          this.renderer.setStyle(this.teamDetailsDiv[0], 'display', 'flex')
        }
        break;
      case 'close':
        if (side == 'home') {
          this.viewTeam = false;
          setTimeout(() => {
            this.renderer.setStyle(this.teamDetailsDiv[0], 'display', 'none')
          }, 500);
        } else {
          this.viewTeam = false;
          setTimeout(() => {
            this.renderer.setStyle(this.teamDetailsDiv[0], 'display', 'none')
          }, 500);
        }
        break;
    }
  }
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

}
