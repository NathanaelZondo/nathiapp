import { FaqsPageModule } from './../faqs/faqs.module';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase'
import { Button } from 'protractor';
import { async } from '@angular/core/testing';
declare var window
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  db = firebase.firestore()
  registrationForm: FormGroup
  phoneNumber = ''
  lastNum = ''
  password = ''
  smsSent
  confirmationResult = ''
  inputCode
  fullName
  uid
  role
  loginLoader
  showPassword = false
  passwordToggleIcon = 'eye'
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier
  constructor(
    public authService: AuthServiceService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public route: Router,
    public loadingController: LoadingController
  ) {
    this.registrationForm = formBuilder.group({
      phoneNumber: [this.phoneNumber, Validators.compose([Validators.required])],
      password: [this.password, Validators.compose([Validators.required, Validators.minLength(6)])],
    })
  }
  async presentLoading() {
    this.loginLoader = await this.loadingController.create({

      message: 'Please wait...',
      translucent: true,
      duration: 2000
    });
    return await this.loginLoader.present();
  }
  ngOnInit() {
  }
  togglePass(): void {
    this.showPassword = !this.showPassword
    if (this.showPassword) {
      this.passwordToggleIcon = 'eye-off'
    } else {
      this.passwordToggleIcon = 'eye'
    }
  }

  addUser(form) {
    let email = form.phoneNumber+'@mail.com'
    firebase.auth().signInWithEmailAndPassword(email, form.password).then(()=>{
      this.presentLoading()
      this.route.navigate(['tabs'])
    }).catch(async err =>{
      const alert = await this.alertController.create({
        header : 'WARNING',
        message : err,
        buttons: [{
          text: 'Okay',
          handler: () => {
            this.registrationForm.reset()
          }
        }]
      });
     await alert.present();
    })
    
  }
  
  //   async requestCode(){
  //     // this.phoneNumber = this.registrationForm.get('phoneNumber').value
  //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  //     console.log(window.recaptchaVerifier);
  //     let appVerifier = window.recaptchaVerifier
  //     return this.authService.requestLogin(this.lastNum, appVerifier).then(async result => {
  //       if(result.success === true){
  //         console.log(result);
  //         this.confirmationResult = result.result
  //         console.log(this.confirmationResult);

  //       }
  //     })
  //   }
  //   logins(code){
  //     if(this.confirmationResult !== ''){
  //       return this.authService.login(code, this.confirmationResult).then(result => {
  //         this.loginLoader.dismiss();
  //         this.route.navigateByUrl('/tabs');
  //       })
  //     }
  //   }
  // ​
  //   addUser(form){
  //     // this.phoneNumber = this.registrationForm.get('phoneNumber').value
  //     // this.fullName = this.registrationForm.get('fullName').value
  //     // this.role = this.registrationForm.get('role').value
  //     this.presentLoading();
  //     let number =  this.phoneNumber.substr(1)
  //     this.lastNum = '+' + 27 + number;
  //     console.log(number, ' s',);
  // this.phoneNumber = form.phoneNumber
  //     console.log('object',this.lastNum );
  //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  //       size: 'invisible',
  //       callback: (response) => {
  //         console.log('checking here');
  //       },
  //       'expired-callback': () => {
  //         console.log('capcha expired');

  //       }
  //     });
  //     console.log(window.recaptchaVerifier);
  //     let appVerifier = window.recaptchaVerifier
  //     return this.authService.requestLogin(this.lastNum, appVerifier).then(async result => {
  //       if(result.success === true){
  //         console.log(result);
  //         this.confirmationResult = result.result
  //         console.log(this.confirmationResult);
  //         setTimeout(() => {
  //           console.log('dismaissed loader');

  //           this.loginLoader.dismiss();
  //         }, 500);
  //        this.alert(form);

  //       } else {
  //         this.loginLoader.dismiss()
  //         const alert = await this.alertController.create({
  //           header: 'Login Unsuccessful',
  //           // subHeader: 'Enter verification code',
  //           message: result.result.message,
  //           backdropDismiss: false,
  //           buttons: [{
  //             text: 'Okay',
  //             cssClass: 'success',
  //             handler: () => {
  //               this.route.navigate(['tabs/home'])
  //             }
  //           }]
  //         });
  //         await alert.present();
  //       }
  //     })
  //   }
  // ​
  //   async alert(form){
  //     const alert = await this.alertController.create({
  //       header: 'Verification code',
  //       backdropDismiss: false,
  //       inputs: [
  //         {
  //           name: 'code',
  //           type: 'tel',
  //           placeholder: 'Enter code'
  //         }],
  //       buttons: [{
  //         text: 'Submit',
  //         role: 'submit',
  //         cssClass: 'secondary',
  //         handler: (result) => {
  //           console.log(result.code);
  //           this.logins(result.code)
  // //           firebase.auth().onAuthStateChanged(res =>{

  // //             if(res.uid ){
  // // this.db.collection('members').doc(res.uid).set({form})
  // //               console.log('see ',res.uid);
  // //             }
  // //           })

  //         }
  //       }]
  //     });
  //     await alert.present();
  //   }
  // ​
  //   login(){
  //     this.phoneNumber = this.registrationForm.get('phoneNumber').value
  //         console.log(this.phoneNumber)
  //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  //     console.log(window.recaptchaVerifier);
  //     let appVerifier = window.recaptchaVerifier
  //     firebase.auth().signInWithPhoneNumber(String(this.lastNum), appVerifier).then(confirmationResult => {
  //       window.confirmationResult = confirmationResult;  
  //     }).catch((error) => {
  //       console.log(error)
  //     });
  //   }
  toReg() {
    this.route.navigate(['registerpage'])
  }
  close() {
    this.route.navigateByUrl('tabs');
  }
}

