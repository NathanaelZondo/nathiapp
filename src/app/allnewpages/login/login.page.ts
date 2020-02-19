import { FaqsPageModule } from './../faqs/faqs.module';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase'
import { Button } from 'protractor';
import { async } from '@angular/core/testing';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
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
  signingIn = false
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier
  constructor(
    public authService: AuthServiceService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public route: Router,
    public loadingController: LoadingController,
    public googleplus :GooglePlus,
    public plt : Platform,
    // private location : Location
  ) {
    this.registrationForm = formBuilder.group({
      phoneNumber: [this.phoneNumber, Validators.compose([Validators.required])],
      // password: [this.password, Validators.compose([Validators.required, Validators.minLength(6)])],
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

  async nativeGoogleLogin() {
    //let credential = '';
    console.log('abc');
    
    try {
      const gplusUser = await this.googleplus.login({
        'webClientId': '81311888576-0i9kvpjn5fo0s72q7ua37bjo42vlh3t8.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
       await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then((i)=>{
        //this.userProfile.doc(i.user.uid).set
        this.route.navigate(['tabs/home'])
       })
    } catch(err) {
      console.log('Error ',err)
    }
  }
  webGoogleLogin() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = firebase.auth().signInWithPopup(provider).then((i)=>{
        if (i.user) {
          console.log('aaa',i);
          
          this.route.navigate(['tabs/home'])
        }
      });
    } catch(err) {
      console.log(err)
    }
  }
  googleLogin() {
    console.log('seko');
    
    if (this.plt.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }
  togglePass(): void {
    this.showPassword = !this.showPassword
    if (this.showPassword) {
      this.passwordToggleIcon = 'eye-off'
    } else {
      this.passwordToggleIcon = 'eye'
    }
  }


  showPrompt() {
    const prompt = this.alertController.create({
      header:'Reset Password',
      message: 'Enter your number so we can send the password reset link.',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            let email = data.name1 + '@mail.com'
            firebase.auth().sendPasswordResetEmail(data.name1).then(
              async () => {
                const alert = await this.alertController.create({
                  message: 'Check your email for a password reset link',
                  buttons: [
                    {
                      text: 'Ok',
                      role: 'cancel',
                      handler: () => {
                 
                          this.presentLoading()
                      }
                    }
                  ]
                });
                await alert.present();
              },
              async error => {
                const errorAlert = await this.alertController.create({
                  message: error.message,
                  buttons: [{ text: 'Ok', role: 'cancel' }]
                });
                await errorAlert.present();
              }
            );
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    // prompt.present();
  }
  toReg() {
    this.route.navigate(['registerpage'])
  }
  close() {
    this.route.navigateByUrl('tabs');
  }
    async requestCode(){
      // this.phoneNumber = this.registrationForm.get('phoneNumber').value
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
      console.log(window.recaptchaVerifier);
      let appVerifier = window.recaptchaVerifier
      return this.authService.requestLogin(this.lastNum, appVerifier).then(async result => {
        if(result.success === true){
          console.log(result);
          this.confirmationResult = result.result
          console.log(this.confirmationResult);

        }
      })
    }
   async logins(code){
      let loader = await this.loadingController.create({
        message: 'Please wait'
      })
      await loader.present()
      if(this.confirmationResult !== ''){
        return this.authService.login(code, this.confirmationResult).then(result => {
          loader.dismiss()
          // this.loginLoader.dismiss();
         
          this.route.navigateByUrl('/tabs');
        })
      }
    }
  ​
  async  addUser(form){
      let loader = await this.loadingController.create({
        message: 'Please wait'
      })
      await loader.present()
      let number =  this.phoneNumber.substr(1)
      this.lastNum = '+' + 27 + number;
      console.log(number, ' s',);
  this.phoneNumber = form.phoneNumber
      console.log('object',this.lastNum );
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('checking here');
        },
        'expired-callback': () => {
          console.log('capcha expired');

        }
      });
      console.log(window.recaptchaVerifier);
      let appVerifier = window.recaptchaVerifier
      return this.authService.requestLogin(this.lastNum, appVerifier).then(async result => {
        if(result.success === true){
          console.log(result);
          loader.dismiss()
          this.confirmationResult = result.result
          console.log(this.confirmationResult);
          setTimeout(() => {
            console.log('dismaissed loader');

            // this.loginLoader.dismiss();
          
          }, 500);
         this.alert(form);

        } else {
          this.loginLoader.dismiss()
          const alert = await this.alertController.create({
            header: 'Login Unsuccessful',
            // subHeader: 'Enter verification code',
            message: result.result.message,
            backdropDismiss: false,
            buttons: [{
              text: 'Okay',
              cssClass: 'success',
              handler: () => {
                this.route.navigate(['tabs/home'])
              }
            }]
          });
          await alert.present();
        }
      })
    }
  ​
    async alert(form){
      const alert = await this.alertController.create({
        header: 'Verification code',
        backdropDismiss: false,
        inputs: [
          {
            name: 'code',
            type: 'tel',
            placeholder: 'Enter code'
          }],
        buttons: [{
          text: 'Submit',
          role: 'submit',
          cssClass: 'secondary',
          handler: (result) => {
            console.log(result.code);
            this.logins(result.code)
  //           firebase.auth().onAuthStateChanged(res =>{

  //             if(res.uid ){
  // this.db.collection('members').doc(res.uid).set({form})
  //               console.log('see ',res.uid);
  //             }
  //           })

          }
        }]
      });
      await alert.present();
    }
  ​
    login(){
      this.phoneNumber = this.registrationForm.get('phoneNumber').value
          console.log(this.phoneNumber)
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
      console.log(window.recaptchaVerifier);
      let appVerifier = window.recaptchaVerifier
      firebase.auth().signInWithPhoneNumber(String(this.lastNum), appVerifier).then(confirmationResult => {
        window.confirmationResult = confirmationResult;  
      }).catch((error) => {
        console.log(error)
      });
    }

}

