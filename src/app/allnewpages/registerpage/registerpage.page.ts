import { Component, OnInit, ViewChild, NgZone, Renderer2 } from '@angular/core';
import { RegisterFormComponent } from 'src/app/components/register-form/register-form.component';
import { UserCredential } from 'src/app/Models/user';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import * as firebase from 'firebase'
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { async } from 'q';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
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
  registrationForm: FormGroup
  smsSent
  confirmationResult = ''
  email=null
  inputCode
  fullName
  uid
  role
  profileImage = 'https://avatarfiles.alphacoders.com/855/85557.png'
  imageProgress = 0
  imageText = 'Profile Image'
  db = firebase.firestore()
  storage = firebase.storage().ref();
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
    private zone : NgZone,
    private camera: Camera

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
  async addUser(form){
    const loading = await this.loadingController.create({
      message: 'Registering',
    });
    await loading.present();
    let email = form.phoneNumber+'@mail.com';
firebase.auth().createUserWithEmailAndPassword(email ,form.password).then((newUserCredential: firebase.auth.UserCredential) => {
  firebase.firestore().doc(`/members/${newUserCredential.user.uid}`).set({
    form ,
    loginEmail : email,
    status: '',
    profileImage: this.profileImage,
    firstEmailRecieved : 'no' ,
    // Token : this.token,
    dateCreated : new Date
    }).then(async ()=>{
      await loading.dismiss();
      this.route.navigateByUrl('/add-team');
    })

})
.catch(async error => {
  console.log(error)
  await loading.dismiss();
  if(error.code =='auth/email-already-in-use'){
    let alerter = await this.alertController.create({
      header: 'Oops',
      message: 'This number has already has an account,if you forgot please click the forgot password button to reset your password',
      buttons : ['OK']
    })
    await alerter.present()
  }else{
    let alerter = await this.alertController.create({
      header: 'Oops',
      message: error.message,
      buttons : ['OK']
    })
    await alerter.present()
  }
  
  // console.error(error);
  // throw new Error(error);
});
  }
  togglePass():void {
    this.showPassword = !this.showPassword
    if (this.showPassword) {
      this.passwordToggleIcon = 'eye-off'
    } else {
      this.passwordToggleIcon = 'eye'
    }
  }
  async getImage() {
    
    let option: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 90,
      targetHeight : 600,
      targetWidth : 600,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then(res => {
      this.profileImage=''
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      const filename = Math.floor(Date.now() / 1000);
      let file =  filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.imageProgress = progress;
        // upload progress state
        if (progress > 0) {
          this.imageText = 'Uploading...'
        } else if (progress > 50) {
          this.imageText = 'Halfway There...'
        } else if (progress == 100) {
          this.imageText = 'Finnishing Upload'
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.profileImage = downUrl;
          this.imageText = 'Done'
          console.log('Image downUrl', downUrl);
          this.imageProgress =0
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }
  // requestCode() {
  //   // this.phoneNumber = this.registrationForm.get('phoneNumber').value
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  //   console.log(window.recaptchaVerifier);
  //   let appVerifier = window.recaptchaVerifier
  //   return this.authService.requestLogin(this.lastNum, appVerifier).then(result => {
  //     if (result.success === true) {
  //       console.log(result);
  //       this.confirmationResult = result.result
  //       console.log(this.confirmationResult);
  //     }
  //   })
  // }
  // logins(code) {
  //   if (this.confirmationResult !== '') {
  //     return this.authService.login(code, this.confirmationResult).then(result => {
  //       console.log(result);
  //     })
  //   }
  // }

  // addUser(form) {
  //   this.presentLoading2()

  //   let number = this.phoneNumber.substr(1)
  //   this.lastNum = '+' + 27 + number;
  //   console.log(number, ' s');

  //   // this.phoneNumber = this.registrationForm.get('phoneNumber').value
  //   this.fullName = this.registrationForm.get('fullName').value
  //   this.role = this.registrationForm.get('role').value

  //   // this.lastNum = form.phoneNumber
  //   console.log('object', this.lastNum);
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  //     size: 'invisible',
  //     callback: (response) => {
  //       console.log('checking here');
  //     },
  //     'expired-callback': () => {

  //     }
  //   });
  //   console.log(window.recaptchaVerifier);
  //   let appVerifier = window.recaptchaVerifier
  //   return this.authService.requestLogin(this.lastNum, appVerifier).then(async result => {
  //     if (result.success === true) {
  //       console.log(result);
  //       this.confirmationResult = result.result
  //       console.log(this.confirmationResult);

  //       this.alert(form);

  //     } else {
  //       console.log(result);
  //       const alert = await this.alertController.create({
  //         header: 'Register Unsuccessful',
  //         // subHeader: 'Enter verification code',
  //         message: result.result.message,
  //         backdropDismiss: false,
  //         buttons: [{
  //           text: 'Okay',
  //           cssClass: 'success',
  //           handler: () => {
  //             this.route.navigate(['tabs/home'])
  //           }
  //         }]
  //       });
  //       await alert.present();
  //     }
  //   })

  //   // this.route.navigateByUrl('add-team')
  // }

  // async alert(form) {
  //   const alert = await this.alertController.create({
  //     header: 'Verification code',
  //     message:  `Code will be sent to <b>${form.phoneNumber}</b>`,
  //     backdropDismiss: false,
  //     inputs: [
  //       {
  //         name: 'code',
  //         type: 'text',
  //         placeholder: 'Enter code'
  //       }],
  //     buttons: [{
  //       text: 'Change Number',
  //       handler:()=> {
  //         window.recaptchaVerifier.clear()
  //       }
  //     },{
  //       text: 'Submit',
  //       role: 'submit',
  //       cssClass: 'secondary',
  //       handler: (result) => {
  //         console.log(result.code);
  //         this.logins(result.code);
  //         this.ngZone.run(() => {
  //           firebase.auth().onAuthStateChanged(res => {
  //             if (this.token) {
  //               if (res.uid) {
  //                 this.db.collection('members').doc(res.uid).set({ form, status: 'awaiting',firstEmailRecieved : 'no' ,Token : this.token})
  //                 console.log('see ', res.uid);
  //               }
  //             } else {
  //               if (res.uid) {
  //                 this.db.collection('members').doc(res.uid).set({ form, status: 'awaiting',firstEmailRecieved : 'no'})
  //                 console.log('see ', res.uid);
  //               }
  //             }
  //           })
  //           this.presentLoading()
  //           // this.renderer.setStyle(this.tabElement[0],'transform','translateY(0vh)')
  //           this.route.navigateByUrl('/tabs');
  //         })
  //       }
  //     }]
  //   });
  //   await alert.present();
  // }

  // login() {
  //   this.phoneNumber = this.registrationForm.get('phoneNumber').value
  //   console.log(this.phoneNumber)
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  //   console.log(window.recaptchaVerifier);
  //   let appVerifier = window.recaptchaVerifier
  //   firebase.auth().signInWithPhoneNumber(String(this.phoneNumber), appVerifier).then(confirmationResult => {
  //     window.confirmationResult = confirmationResult;
  //   }).catch((error) => {
  //     console.log(error)
  //   });
  // }


  // async presentLoading2() {
  //   const loading = await this.loadingController.create({
  //     message: 'Please wait',
  //     duration: 3000
  //   });
  //   await loading.present();

  //   // const { role, data } = await loading.onDidDismiss();

  //   // console.log('Loading dismissed!');
  // }
  close() {
    // this.renderer.setStyle(this.tabElement[0],'transform','translateY(0vh)')
    this.route.navigateByUrl('tabs');
  }
  goLogin() {
    this.route.navigate(['login'])
  }
}
