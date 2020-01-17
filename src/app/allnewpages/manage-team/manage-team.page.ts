import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Router,NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.page.html',
  styleUrls: ['./manage-team.page.scss'],
})
export class ManageTeamPage implements OnInit {
  playerMore =  null;
  isTeam = false;
  isNotTeam = false;
  db = firebase.firestore();
  display = {} as any
  isPlayer = false;
  players = []
  noTeam = document.getElementsByClassName('noTeam')
  createTeam = false;
  profile = false
    constructor(  public renderer: Renderer2,  private formBuilder: FormBuilder, public router : Router,public navctrl : NavController) { 
   
      
    }
    editTean() {
      const parms: NavigationExtras  = {
        state: {
          isEditing: true,
          data: this.display 
        }
      }
      this.router.navigateByUrl('add-team',parms)
    }
    back(){
      this.navctrl.pop()
    }
    ngOnInit() {
      this.getTeam();
      this.checkProfile()
    }
    addTeam(){
      this.router.navigateByUrl('add-team');
    }
    addPlayer(){
      this.router.navigateByUrl('add-player');
    }
  getTeam() {
    this.db.collection('Teams').doc(firebase.auth().currentUser.uid).onSnapshot(res =>{
      if(res.exists){
       console.log('data',res.data());
       this.isTeam = true;
       setTimeout(() => {
        this.renderer.setStyle(this.noTeam[0],'display','none')
       }, 500);
       this.display = res.data();
       
      //  this.isNotTeam = false;
      } else {
        this.createTeam = true;
      }
      this.db.collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').onSnapshot(res => {
        this.players = [];
        if (!res.empty) {
          res.forEach(doc => {
            this.players.push(doc.data());
            console.log('players', this.players);

            this.isPlayer = true;
          });
        }
      });
    });
  }
  viewPlayer(i) {
    if(this.playerMore==i) {
      this.playerMore = null
    } else {
      this.playerMore = i
    }
  }
  checkProfile() {
    this.db.collection('members').doc(firebase.auth().currentUser.uid).onSnapshot(res =>{
      if(res.data().status == 'awaiting'){
        console.log('no profile');
        
      }else{
        this.profile = true
      }
    })
  }
}

