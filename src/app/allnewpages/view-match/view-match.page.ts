import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase'
@Component({
  selector: 'app-view-match',
  templateUrl: './view-match.page.html',
  styleUrls: ['./view-match.page.scss'],
})
export class ViewMatchPage implements OnInit {
  viewingMatch = null
  db = firebase.firestore()
  constructor(public navCtrl: NavController, private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.viewingMatch = this.router.getCurrentNavigation().extras.state.parms
        // 
        
      }});
  }

}
