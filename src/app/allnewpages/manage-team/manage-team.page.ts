import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Router,NavigationExtras } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.page.html',
  styleUrls: ['./manage-team.page.scss'],
})
export class ManageTeamPage implements OnInit {
  playerMore = null;
  isTeam = false;
  isNotTeam = false;
  db = firebase.firestore();
  display = {} as any
  isPlayer = false;
  players = []
  createTeam = false;
  profile = false
  enlarge = null
  arr :any = [1,2,3,4,5,6,7,8,9,0,1]
  player = []
    constructor(  public renderer: Renderer2,  private formBuilder: FormBuilder, public router : Router,public navctrl : NavController,public alertController : AlertController) { 
      
    }
    async presentAlertCheckbox() {
      firebase.auth().onAuthStateChanged( user =>{
        if(user){
          firebase.firestore().collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').get().then(async res =>{
            this.player = []
            let player = {
       
               type: 'checkbox',
               label: 'Checkbox 1',
               value: 'value1',
             }
             res.forEach( doc =>{
               
               player = {
                 type: 'checkbox',
                 label: doc.data().fullName,
                 value: doc.id,
               }
               this.player.push(player)
               player = {
                 type: 'checkbox',
                 label: null,
                 value: null,
               }
             })
                 const alert = await this.alertController.create({
             header: 'Select your players',
             message: 'Please select your players',
             inputs: this.player,
             buttons: [
               {
                 text: 'Cancel',
                 role: 'cancel',
                 cssClass: 'secondary',
                 handler: () => {
                   console.log('Confirm Cancel');
                 }
               }, {
                 text: 'Ok',
                 handler: data => {
                   data.forEach(element => {
                     console.log(element);
                     firebase.firestore().collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').doc(element).update({
                       status : 'available'
                     })
                   });
               
                   console.log('Confirm Ok', data);
                 }
               }
             ]
           });
       
           await alert.present();
           }) 
        }
      })
      }
    editTean() {
      const parms: NavigationExtras  = {
        state: {
          isEditing: true,
          data: this.display 
        }
      }
    this.router.navigateByUrl('add-team', parms)
  }
  back() {
    this.navctrl.pop()
  }
  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      firebase.auth().updateCurrentUser(user).then(res => {
        this.getTeam();
        this.checkProfile()
      })
    })

  }
  longPress(ev) {
    console.log(ev);
    
  }
  addTeam() {
    const parms: NavigationExtras = {
      state: {
        isEditing: true,
        data: this.display
      }
    }
    this.router.navigateByUrl('add-team', parms)
  }
  addPlayer() {
    this.router.navigateByUrl('add-player');
  }
  getTeam() {

    this.db.collection('Teams').doc(firebase.auth().currentUser.uid).onSnapshot(res => {
      if (res.exists) {
        console.log('data', res.data());
        this.isTeam = true;
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


          });
          this.isPlayer = true;
          this.arr = this.players
        }
      });
    });
  }
  viewPlayer(i) {
    if (this.playerMore == i) {
      this.playerMore = null
    } else {
      this.playerMore = i
    }
  }
  checkProfile() {
    this.db.collection('members').doc(firebase.auth().currentUser.uid).onSnapshot(res => {
      if (res.data().status == 'awaiting') {
        console.log('no profile');

      } else {
        this.profile = true
      }
    })
  }
  enlargeImage(image) {
    if (this.enlarge == image) {
      this.enlarge = null
    } else {
      this.enlarge = image;
    }
  }
}

