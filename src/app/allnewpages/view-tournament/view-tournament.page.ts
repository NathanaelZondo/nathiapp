import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router} from '@angular/router';
import { NavigationExtras } from '@angular/router';
import * as firebase from 'firebase'
import { PassInformationServiceService } from 'src/app/service/pass-information-service.service';
@Component({
  selector: 'app-view-tournament',
  templateUrl: './view-tournament.page.html',
  styleUrls: ['./view-tournament.page.scss'],
})
export class ViewTournamentPage implements OnInit {
  viewedTournament = null
  tournMatches = []
  match = {
    type1:[],// 1
    type2: [],// 2
    type4: [], // 8
    type8: [], // 16
    type16: [], // 32
    winner: {} as any
  }
  db = firebase.firestore()
  category = null
  constructor(public pass:PassInformationServiceService,public navCtrl: NavController, private activatedRoute: ActivatedRoute,private router: Router) { }
tournid ;
  ngOnInit() {
    // receives nav params
    
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.viewedTournament = this.router.getCurrentNavigation().extras.state.parms
        console.log(this.viewedTournament);
        this.pass.tournid =this.viewedTournament.doc_id;
        this.tournid =this.viewedTournament.doc_id;
        if(this.viewedTournament.state=='finished') {
          // finnished matches
          this.db.collection('PlayedMatches').where('tournid','==',this.viewedTournament.doc_id).orderBy("matchdate", "desc").get().then(res => {
        
            this.tournMatches = []
            this.match = {
              type1:[],// 1
              type2: [],// 2
              type4: [], // 8
              type8: [], // 16
              type16: [], // 32
              winner: {}
            }
            res.forEach(doc => {
              // CHECK WICH MATCH TYPE IS WHICH AND PUSH IT INTO THE RESPECTIVE ARRAY
              if(doc.data().type=='16') {
                this.match.type16.push(doc.data())
              } else if (doc.data().type=='8') {
                this.match.type8.push(doc.data())
              } else if (doc.data().type=='4') {
                this.match.type4.push(doc.data())
              } else if (doc.data().type=='2') {
                this.match.type2.push(doc.data())
              } else if (doc.data().type=='1') {
                this.match.type1.push(doc.data())
                if(doc.data().score>=1) {
                  this.match.winner = doc.data().TeamObject
                } else {
                  this.match.winner = doc.data().aTeamObject
                }
              }
            })
            this.checkMatches()
            console.log(this.match);

          }).catch(err => {console.log(err);})
        } else {
          // these are upcoming ur inplay matches
          this.db.collection('MatchFixtures').where('tournid','==',this.viewedTournament.doc_id).orderBy("matchdate", "desc").get().then(res => {
        
            this.tournMatches = []
            this.match = {
              type1:[],// 1
              type2: [],// 2
              type4: [], // 8
              type8: [], // 16
              type16: [], // 32
              winner: {}
            }
            res.forEach(doc => {
              if(doc.data().type=='16') {
                this.match.type16.push(doc.data())
              } else if (doc.data().type=='8') {
                this.match.type8.push(doc.data())
              } else if (doc.data().type=='4') {
                this.match.type4.push(doc.data())
              } else if (doc.data().type=='2') {
                this.match.type2.push(doc.data())
              } else if (doc.data().type=='1') {
                this.match.type1.push(doc.data())
                if(doc.data().score>=1) {
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
      }});
  }
checkMatches() {
  if (this.match.type16.length>0) {
    this.tournMatches = this.match.type16
    this.category = 'top32'
  } else if (this.match.type8.length>0) {
    this.tournMatches = this.match.type8
    this.category = 'top16'
  } else if (this.match.type4.length>0) {
    this.tournMatches = this.match.type4
    this.category = 'top8'
  } else if (this.match.type2.length>0) {
    this.tournMatches = this.match.type2
    this.category = 'top4'
  } else {
    this.tournMatches = this.match.type1
    this.category = 'top2'
  }
}
  goBack() {
    this.router.navigate(['tabs'])
    this.viewedTournament = null
  }
  segmentChanged(ev) {
    let event = ev.detail.value;
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
        parms:match,
        tournament: this.viewedTournament
      }
    };
    // passes nav params
    this.router.navigate(['view-match'],navigationExtras);
  }
}
