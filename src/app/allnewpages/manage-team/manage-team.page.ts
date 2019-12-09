import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.page.html',
  styleUrls: ['./manage-team.page.scss'],
})
export class ManageTeamPage implements OnInit {
  isTeam = false;
  isNotTeam = false
  db = firebase.firestore();
  display = {}
  isPlayer = false
  players = []
    constructor(    private formBuilder: FormBuilder, public router : Router,public navctrl : NavController) { 
   
      
    }
    back(){
      this.navctrl.pop()
    }
    ngOnInit() {
      while (this.players.length < 10) {
        this.players.push('card')
      }
      this.getTeam();
    }
    addTeam(){
      this.router.navigateByUrl('add-team');
    }
    addPlayer(){
      this.router.navigateByUrl('add-player');
    }
  getTeam(){
    this.db.collection('Teams').doc(firebase.auth().currentUser.uid).get().then(res =>{
      if(res.exists){
       console.log('data',res.data());
       this.isTeam = true;
       this.display = res.data();
       
      //  this.isNotTeam = false;
      }
      this.db.collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').onSnapshot(res =>{
        this.players = []
        if(!res.empty){
          res.forEach(doc =>{
  this.players.push(doc.data())
  console.log('players', this.players);
  
            this.isPlayer = true
          })
        }
      })
    })
  }
  }
  
