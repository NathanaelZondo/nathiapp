import { Component, OnInit, ViewChild, NgZone, Renderer2 } from '@angular/core';
import { RegisterFormComponent } from 'src/app/components/register-form/register-form.component';
import { UserCredential } from 'src/app/Models/user';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import * as firebase from 'firebase'
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { async } from 'q';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
declare var window
@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.page.html',
  styleUrls: ['./registerpage.page.scss'],
})
export class RegisterpagePage implements OnInit {
  tabElement = document.getElementsByTagName('ion-tab-bar')
  phoneNumber = ''
  lastNum = ''
  password
  registrationForm
  smsSent
  confirmationResult = ''
  email=null
  inputCode
  fullName
  uid
  role
  db = firebase.firestore()
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier
  Profile = {
    number: '',
    fullName: '',
    email: null,
    uid: '',
    role: ''
  }
  token
  showPassword = false
  passwordToggleIcon = 'eye'
  constructor(
    public authService: AuthServiceService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public route: Router,
    public loadingController: LoadingController,
    public ngZone: NgZone,
    public renderer: Renderer2,
    public fcm : FCM,
    private zone : NgZone

  ) {
    this.smsSent = false

    firebase.auth().languageCode = 'en';

    this.registrationForm = formBuilder.group({
      phoneNumber: [this.phoneNumber, Validators.compose([Validators.required])],
      fullName: ['', Validators.required],
      role: ['', Validators.required],
      email: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: [this.password, Validators.compose([Validators.required,Validators.minLength(6)])],
    })

  }
  ngOnInit() {
    this.zone.run(()=>{
      this.fcm.getToken().then( token =>{
        this.token = token
      })
    })
    // firebase.auth().onAuthStateChanged(res => {
    //   if (res) {
    //     this.profileService.storeAdmin(res);
    //     this.route.navigateByUrl('home', { skipLocationChange: true });
    //   }
    // });
  }
  togglePass():void {
    this.showPassword = !this.showPassword
    if (this.showPassword) {
      this.passwordToggleIcon = 'eye-off'
    } else {
      this.passwordToggleIcon = 'eye'
    }
  }
  requestCode() {
    // this.phoneNumber = this.registrationForm.get('phoneNumber').value
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    console.log(window.recaptchaVerifier);
    let appVerifier = window.recaptchaVerifier
    return this.authService.requestLogin(this.lastNum, appVerifier).then(result => {
      if (result.success === true) {
        console.log(result);
        this.confirmationResult = result.result
        console.log(this.confirmationResult);
      }
    })
  }
  logins(code) {
    if (this.confirmationResult !== '') {
      return this.authService.login(code, this.confirmationResult).then(result => {
        console.log(result);
      })
    }
  }

  addUser(form) {
    this.presentLoading2()

    let number = this.phoneNumber.substr(1)
    this.lastNum = '+' + 27 + number;
    console.log(number, ' s');

    // this.phoneNumber = this.registrationForm.get('phoneNumber').value
    this.fullName = this.registrationForm.get('fullName').value
    this.role = this.registrationForm.get('role').value

    // this.lastNum = form.phoneNumber
    console.log('object', this.lastNum);
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('checking here');
      },
      'expired-callback': () => {

      }
    });
    console.log(window.recaptchaVerifier);
    let appVerifier = window.recaptchaVerifier
    return this.authService.requestLogin(this.lastNum, appVerifier).then(async result => {
      if (result.success === true) {
        console.log(result);
        this.confirmationResult = result.result
        console.log(this.confirmationResult);

        this.alert(form);

      } else {
        console.log(result);
        const alert = await this.alertController.create({
          header: 'Register Unsuccessful',
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

    // this.route.navigateByUrl('add-team')
  }

  async alert(form) {
    const alert = await this.alertController.create({
      header: 'Verification code',
      message:  `Code will be sent to <b>${form.phoneNumber}</b>`,
      backdropDismiss: false,
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'Enter code'
        }],
      buttons: [{
        text: 'Change Number',
        handler:()=> {
          window.recaptchaVerifier.clear()
        }
      },{
        text: 'Submit',
        role: 'submit',
        cssClass: 'secondary',
        handler: (result) => {
          console.log(result.code);
          this.logins(result.code);
          this.ngZone.run(() => {
            firebase.auth().onAuthStateChanged(res => {
              if (this.token) {
                if (res.uid) {
                  this.db.collection('members').doc(res.uid).set({ form, status: 'awaiting',firstEmailRecieved : 'no' ,Token : this.token})
                  console.log('see ', res.uid);
                }
              } else {
                if (res.uid) {
                  this.db.collection('members').doc(res.uid).set({ form, status: 'awaiting',firstEmailRecieved : 'no'})
                  console.log('see ', res.uid);
                }
              }
            })
            this.presentLoading()
            // this.renderer.setStyle(this.tabElement[0],'transform','translateY(0vh)')
            this.route.navigateByUrl('/tabs');
          })
        }
      }]
    });
    await alert.present();
  }

  login() {
    this.phoneNumber = this.registrationForm.get('phoneNumber').value
    console.log(this.phoneNumber)
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    console.log(window.recaptchaVerifier);
    let appVerifier = window.recaptchaVerifier
    firebase.auth().signInWithPhoneNumber(String(this.phoneNumber), appVerifier).then(confirmationResult => {
      window.confirmationResult = confirmationResult;
    }).catch((error) => {
      console.log(error)
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loging In',
      duration: 2000
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();

    // console.log('Loading dismissed!');
  }
  async presentLoading2() {
    const loading = await this.loadingController.create({
      message: 'Please wait',
      duration: 3000
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();

    // console.log('Loading dismissed!');
  }
  close() {
    // this.renderer.setStyle(this.tabElement[0],'transform','translateY(0vh)')
    this.route.navigateByUrl('tabs');
  }
  goLogin() {
    this.route.navigate(['login'])
  }
}
