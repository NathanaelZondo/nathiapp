import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AlertController } from '@ionic/angular';
import { PassInformationServiceService } from './pass-information-service.service';
declare var window
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  email
  password
  //confirmationResult
 role
  public userProfile: firebase.firestore.DocumentReference;
  public currentUser: firebase.User;
user
profile = {}
  constructor(public alertCtrl: AlertController,public pass: PassInformationServiceService) { 
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.firestore().doc(`/members/${user.uid}`);
      }
    });
  }
  getUserProfile(): firebase.firestore.DocumentReference {
    return this.userProfile;
  }

  getUser(){
    return this.user;
  }
  setUser(val){
    this.user = val;
    console.log('User form Provider', this.user);
    // firebase.firestore().collection('members').doc(this.user).get().then(res =>{
    //   this.role = res.data().form.role;
    //   this.profile = res.data()

    //    console.log('role',this.role);
    //    console.log('document',this.profile);
       
    // })
  }
getProfile(){
return this.profile

}
  requestLogin(number, appVerifier){
    return firebase.auth().signInWithPhoneNumber(number, appVerifier).then(confirmationResult => {
      window.confirmationResult = confirmationResult;
​
      let result = {success: true, result: confirmationResult}
      return result
    }).catch((error) => {
      let result = {success: false, result: error}
      return result
    });
  }
​  logoutUser(): Promise<void> {
  return firebase.auth().signOut();
}
  login(code, confirmationResult){
    return confirmationResult.confirm(code).then( (result) => {
      var user = result.user; console.log(user);
      return user
    }).catch(function (error) {
      console.log(error);
      return error
    });
  }
  //Adding new users to the database
  register(email, password){
​
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(data => {
      // this.setCurrentSession(firebase.auth())
      // this.checkingAuthState()
      let userEmail = email;
      let userName = name;
      let userID = data.user.uid;
      //let now = moment().format('LLLL')
      console.log(userID)
      firebase.firestore().collection('Users/').doc(userID).set({
        email: userEmail,
        name: userName,
        role: 'Admin',
        hasProfilePic: false,
        hasRequestedLink: false,          //when the user has requested to link his/her account with someone else
        hasReceivedLinkRequest: false,    //when the user has received a link request from another user
        //registeredAt: now
      })
      return data
     }).catch((error) => {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       console.log(errorMessage)
       // ...
       return error
     })
  }
  //Allowing users to reset their password
  passwordReset(emailAddress){
    firebase.auth().sendPasswordResetEmail(emailAddress).then(() => {
      // Email sent.
      console.log("Email has been sent")
    }).catch((error) => {
      // An error happened.
      console.log(error)
    });
  }
  //Function : Routing logged out users to the login page
  signOut()
  {
    return new Promise((resolve, reject) =>{
      firebase.auth().signOut().then(()=> {
        // Sign-out successful.
        
        resolve()
        this.checkingAuthState().then(data=>{
          console.log(data);
        });
        
      }).catch(error => {
        // An error happened.
      });
    })
  }
​
  getUserProfiles(userId)  {
    return firebase.firestore().collection("Users/").doc(userId).get().then((snapshot) =>{
      // Edit
      let profile = snapshot.data()
      if(profile.hasProfilePic){
        return firebase.storage().ref('userDisplayPic/' + userId).getDownloadURL().then(url =>{
            profile['profilePicUrl'] = url
            return profile
          })
      }else{
          profile['profilePicUrl'] = "../assets/icon/person.png"
          return profile
      }
    })
  }
​
  checkingAuthState(){
    return new Promise((resolve, reject) =>{
      firebase.auth().onAuthStateChanged((user) =>{
        if(user){
          console.log(user);
          
          resolve (user)
        }else{
          console.log('not logged in');
          
        }
      })
    })
  }
}
