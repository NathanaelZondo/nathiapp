import { Component, OnInit, ViewChild, NgZone, Renderer2 } from '@angular/core';
import { RegisterFormComponent } from 'src/app/components/register-form/register-form.component';
import { UserCredential } from 'src/app/Models/user';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import * as firebase from 'firebase';
import { AlertController, LoadingController, IonSlides, Platform } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { async } from 'q';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Button } from 'protractor';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
declare var window
@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.page.html',
  styleUrls: ['./registerpage.page.scss'],
})
export class RegisterpagePage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides
  tabElement = document.getElementsByTagName('ion-tab-bar')
  phoneNumber = ''
  lastNum = ''
  // password
  registrationForm: FormGroup
  smsSent
  confirmationResult = ''
  email
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
  vendorInfo = false
  vendorDiv = document.getElementsByClassName('vendorInfo')
  managerInfo = false
  managerDiv = document.getElementsByClassName('managerInfo')

  constructor(
    public authService: AuthServiceService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public route: Router,
    public loadingController: LoadingController,
    public ngZone: NgZone,
    public renderer: Renderer2,
    public fcm: FCM,
    private zone: NgZone,
    private camera: Camera,
    private plt : Platform,
    public googleplus :GooglePlus,
  ) {
    this.smsSent = false

    firebase.auth().languageCode = 'en';

    this.registrationForm = formBuilder.group({
      phoneNumber: [this.phoneNumber, Validators.compose([Validators.required])],
      fullName: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      // password: [this.password, Validators.compose([Validators.required,Validators.minLength(6)])],
    })
  }
  slideOpts = {
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    on: {
      beforeInit: function () {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true,
        };

        this.params = Object.assign(this.params, overwriteParams);
        this.originalParams = Object.assign(this.originalParams, overwriteParams);
      },
      setTranslate: function () {
        const swiper = this;
        const {
          $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }
            $cubeShadowEl.css({ height: `${swiperWidth}px` });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + (round * 4 * swiperSize);
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = (3 * swiperSize) + (swiperSize * 4 * round);
          }
          if (rtl) {
            tx = -tx;
          }

          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }

          const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = (slideIndex * 90) + (progress * 90);
            if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
          }
          $slideEl.transform(transform$$1);
          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }
        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`,
        });

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
            const multiplier = 1.5 - (
              (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
              + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
            );
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset$$1 = params.shadowOffset;
            $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
          }
        }

        const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
        $wrapperEl
          .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
      },
      setTransition: function (duration) {
        const swiper = this;
        const { $el, slides } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      },
    }
  }
  ionViewWillEnter() {
    console.log('enterd');
    this.slides.lockSwipes(false)

    this.slides.isBeginning().then(res => {
      console.log(res);

      if (!res) {
        this.slides.slidePrev()
        this.slides.lockSwipes(true)
      } else {
        this.slides.lockSwipes(true)
      }
    });

  }
  ngOnInit() {
    let n = this.slides.getActiveIndex().then(i => {
      console.log('aaaaccvb', i);

    })
    console.log('slide number', n);


    this.zone.run(() => {
      this.fcm.getToken().then(token => {
        this.token = token
      })
    })
  }
  information(ev) {
    let role = null
    if (ev.detail) {
      role = ev.detail.value
    } else {
      role = ev
    }

    console.log(role);

    switch (role) {
      case 'teamManager':
        this.managerInfo = true
        this.renderer.setStyle(this.managerDiv[0], 'display', 'block')
        this.vendorInfo = false;
        setTimeout(() => {
          this.renderer.setStyle(this.vendorDiv[0], 'display', 'none')
        }, 500);
        break;
      case 'vendor':
        this.vendorInfo = true;
        this.renderer.setStyle(this.vendorDiv[0], 'display', 'block')
        this.managerInfo = false
        setTimeout(() => {
          this.renderer.setStyle(this.managerDiv[0], 'display', 'none')
        }, 500);
        break;
      case 'close':
        this.managerInfo = false
        this.vendorInfo = false;
        setTimeout(() => {
          this.renderer.setStyle(this.managerDiv[0], 'display', 'none')
          this.renderer.setStyle(this.vendorDiv[0], 'display', 'none')
        }, 500);
    }
  }
  slideNext() {
    this.slides.lockSwipes(false)
    this.slides.slideNext(300, true).then(res => {
      console.log(res);
      this.slides.lockSwipes(true)
    })
  }
  togglePass(): void {
    this.showPassword = !this.showPassword
    if (this.showPassword) {
      this.passwordToggleIcon = 'eye-off'
    } else {
      this.passwordToggleIcon = 'eye'
    }
  }
  //Google login
  async googleLogin() {
    console.log('i am here',this.phoneNumber);
    
    if (!this.phoneNumber && !this.role) {
      let alert = await this.alertController.create({
        header: 'OOPS',
        message: 'Please fill in your phone number and role before proceeding',
        buttons: ['OK']
      })
         await alert.present()
    }else{
        
    if (this.plt.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
    }
  }
  async nativeGoogleLogin() {
    console.log('abc');
    
      const gplusUser = await this.googleplus.login({
        'webClientId': '81311888576-0i9kvpjn5fo0s72q7ua37bjo42vlh3t8.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
       await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)).then((i)=>{
        //this.userProfile.doc(i.user.uid).set
        console.log(i);
        
        this.fullName = i.user.displayName
        this.email = i.user.email
        this.profileImage = i.user.photoURL
      this.slideNext()
       }).catch(err => {
         console.log(err);
         
       })
  }
  webGoogleLogin() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = firebase.auth().signInWithPopup(provider).then((i)=>{
        if (i.user) {
          console.log('aaa',i);
          this.fullName = i.user.displayName
          this.email = i.user.email
          this.profileImage = i.user.photoURL
          this.slideNext()
        }
      });
    } catch(err) {
      console.log(err)
    }
  }
  async getImage() {
    let option: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 90,
      targetHeight: 600,
      targetWidth: 600,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then(res => {
      this.profileImage = ''
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      const filename = Math.floor(Date.now() / 1000);
      let file = filename + '.jpg';
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
          this.imageProgress = 0
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }
  //Phone Number Login
  register() {
    firebase.auth().onAuthStateChanged(i => {
      console.log('aid found', i.uid, ' aa', this.email, this.fullName);

      firebase.firestore().collection('members').doc(i.uid).update({
        form: {
          fullName: this.fullName,
          email: this.email
        }
      }).then(re => {
        this.presentLoading2()
        this.route.navigate(['tabs/home'])
      })

    })
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
 async logins(code) {
  let loader = await this.loadingController.create({
    message: 'Please wait'
  })
  await loader.present()
    if (this.confirmationResult !== '') {
      return this.authService.login(code, this.confirmationResult).then(async result => {
        console.log(result);
        loader.dismiss()
        console.log('uid', result.uid);
        // let form = {
        //   phoneNumber: rm.phoneNumber,
        //   role: rm.role
        // }
        if (result.code == 'auth/invalid-verification-code') {
          console.log('error');
          let alerter = await this.alertController.create({
            header: 'Oops',
            message: result.message,
            buttons: [{
              text: 'Okay',
              cssClass: 'success',
              handler: () => {
                //  this.addUser(rm)
              }
            }]
          })
          await alerter.present()

        }
        else {
          // this.db.collection('members').doc(result.uid).set({ form, status: 'awaiting', firstEmailRecieved: 'no', Token: '' })
          this.presentLoading2()
          this.slideNext()
        }

      }).catch(err => {
        console.log('ditate', err);

      })
    }
  }
  async userAdd() {
    let loader = await this.loadingController.create({
      message: 'Please wait'
    })

    await loader.present()

    let number = this.phoneNumber.substr(1)
    this.lastNum = '+' + 27 + number;
    console.log(number, ' s');
    this.fullName = this.registrationForm.get('fullName').value
    this.role = this.registrationForm.get('role').value
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
        // console.log('form', form);
        await loader.dismiss()
        this.alert();

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

  async addUser(form) {
      let loader = await this.loadingController.create({
        message:'Please wait...'
      })
      await loader.present()
    firebase.auth().onAuthStateChanged(i => {
      console.log('aid found', i.uid, ' aa', this.email, this.fullName);

      firebase.firestore().collection('members').doc(i.uid).set({ form, firstEmailRecieved: 'no', Token: '' ,status : ''}).then(async re => {
        await loader.dismiss()
        if(form.role == 'teamManager'){
          this.route.navigateByUrl("/add-team")
        } else {
          this.route.navigateByUrl("/tabs")
        }
      
      })

    })
  }

  async alert() {
    const alert = await this.alertController.create({
      header: 'Verification code',
      message: `Code will be sent to <b>${this.phoneNumber}</b>`,
      backdropDismiss: false,
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'Enter code'
        }],
      buttons: [{
        text: 'Change Number',
        handler: () => {
          window.recaptchaVerifier.clear()
        }
      }, {
        text: 'Submit',
        role: 'submit',
        cssClass: 'secondary',
        handler: (result) => {

          console.log(result.code);
          this.logins(result.code);
          this.ngZone.run(() => {

          })
        },
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
