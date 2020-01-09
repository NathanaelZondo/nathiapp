import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router} from '@angular/router';
import { NavigationExtras } from '@angular/router';
import * as firebase from 'firebase'
@Component({
  selector: 'app-view-tournament',
  templateUrl: './view-tournament.page.html',
  styleUrls: ['./view-tournament.page.scss'],
})
export class ViewTournamentPage implements OnInit {
  viewedTournament = null
  tournMatches = []
  db = firebase.firestore()
  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    // receives nav params
    
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.viewedTournament = this.router.getCurrentNavigation().extras.state.parms
        console.log(this.viewedTournament);
        this.db.collection('MatchFixtures').where('tournid','==',this.viewedTournament.doc_id).orderBy("matchdate", "desc").get().then(res => {
          console.log(res)
          this.tournMatches = []
          res.forEach(doc => {
            this.tournMatches.push(doc.data())
          })
          console.log(this.tournMatches);
          
        }).catch(err => {
          console.log(err);
          
        })
      }});
  }

  goBack() {
    this.router.navigate(['tabs'])
    this.viewedTournament = null
  }
  viewMatch(match) {
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
