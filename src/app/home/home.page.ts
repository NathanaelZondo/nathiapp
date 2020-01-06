import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { menuController } from '@ionic/core';
import { MenuComponent } from '../components/menu/menu.component';
import * as firebase from 'firebase';
import { PassInformationServiceService } from '../service/pass-information-service.service';
import { AuthServiceService } from '../service/auth-service.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  popover1;
  db = firebase.firestore()
  role
  user
  token
  inprogress = []
  upcoming = []
  finnished = []
  accountRole = null
    constructor(public router:Router,
      public popoverController: PopoverController,
      public pass : PassInformationServiceService, 
      public auth: AuthServiceService,
      public splashScreen: SplashScreen,
      // private oneSignal: OneSignal,
      public ngZone: NgZone) {
  
  // this.router.navigate(['tournament']);
  // console.log('uid',firebase.auth().currentUser.uid);
  // this.getUserProfile()
  // this.user = firebase.auth().currentUser.uid
  
  
    }
  async  popover(){
    this. popover1 = await this.popoverController.create({
      component: MenuComponent,
      translucent: true
    });
    return await this.popover1.present();
  
    }
    
  ionViewWillLeave()
  {
    this.popover1.dismiss(); 
  }
  /*
  getToken(){
    this.oneSignal.getIds().then(res =>{
      this.token = res.userId;
    })
  firebase.auth().onAuthStateChanged(res =>{
    if(res.uid){
      firebase.firestore().collection('Tokens').add({
        uid: res.uid,
        token: this.token
      })
      
    }else if(!res.uid){
      firebase.firestore().collection('Tokens').add({
        uid: '',
        token: this.token
      })
    }
  })
    
  }
  */
  ngOnInit(){
    this.ngZone.run(()=>{
      this.auth.setUser(this.user);
      // this.getUserProfile();
      this.getUser();
    })
    // this.getToken();
    setTimeout(() => {
      console.log('home', this.pass.role);
    }, 500);
    setTimeout(() => {
      this.splashScreen.hide()
    }, 3000);
  }
  addTeam() {
    this.router.navigateByUrl('add-team');
  }
  viewTournament() {
    this.router.navigateByUrl('tournament')
  }

  getUser(){
    this.ngZone.run(()=>{
    
    firebase.auth().onAuthStateChanged(state =>{
      
      
      if(state){
        this.db.collection('members').doc(state.uid).onSnapshot(res =>{
          console.log(res);
          
          if(res.exists){
            console.log(res.data());
            
            this.pass.role = res.data().form.role;
            this.accountRole = res.data().form.role;
          }
        });
      }else{
        this.accountRole = 'user'
      }
   
    })
  
    
    })
  }

}
