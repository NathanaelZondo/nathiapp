import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import * as firebase from 'firebase'
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  db = firebase.firestore()
  listDiv = document.getElementsByClassName('tList')
  storage = firebase.storage().ref();
  timeout = null;
  profile = {
    form: {
      fullName: null,
      phoneNumber: null,
      email: null
    },
    status: "awaitin",
    profileImage: 'https://avatarfiles.alphacoders.com/855/85557.png'
  }
  skeleton = [1,1]
  tournaments = []
  vendorTournaments = []
  participatingTourn = []
  loggedInUser = null
  profileForm
  imageProgress = 0
  imageText = 'Uploade Image'
  editProfile = document.getElementsByClassName('editProfile')
  editMode = false
  role = null
  constructor(public router: Router, private alertCtrl: AlertController,public formBuilder: FormBuilder,private camera: Camera, public renderer: Renderer2, public toastCtrl: ToastController, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      phoneNumber: [this.profile.form.phoneNumber, Validators.compose([Validators.required])],
      fullName: [this.profile.form.fullName, Validators.required],
      email: [this.profile.form.email,[Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    })
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
      this.profile.profileImage=''
      const image = `data:image/jpeg;base64,${res}`;

      const filename = Math.floor(Date.now() / 1000);
      let file = firebase.auth().currentUser.uid + filename + '.jpg';
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
      },async err => {
        let toaster = this.toastCtrl.create({
          message: 'Error Uploading Image. Try again.',
          duration: 2000,
          buttons:[{icon:'close'}]
        })
        await (await toaster).present()
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.profile.profileImage = downUrl;
          this.imageText = 'Done'
    
          this.imageProgress =0
        })
      })
    },async err => {
        let toaster = this.toastCtrl.create({
          message: 'Error Selecting Image',
          duration: 2000,
          buttons:[{icon:'close'}]
        })
        await (await toaster).present()
    })
  }
  ionViewWillEnter(){
    firebase.auth().onAuthStateChanged(user => {
      firebase.auth().updateCurrentUser(user).then(() => {
        this.loggedInUser = user
        
        this.db.collection('members').doc(this.loggedInUser.uid).get().then(res => {
          this.profile.form.fullName = res.data().form.fullName
          this.profile.form.phoneNumber = res.data().form.phoneNumber
          this.profile.status = res.data().status
          this.profile.form.email = res.data().form.email
          this.role = res.data().form.role
          if (res.data().profileImage) {
            this.profile.profileImage = res.data().profileImage
          }

          if (res.data().form.role == 'teamManager') {
            console.log('Manager');
            
            this.getManagerTournaments()
          } else {
            console.log('Vendor');
            
            this.getVendorTournaments()
          }
        })
      })
    })
  }
  // fitElementToParent(el, padding) {
  //   if (this.timeout) clearTimeout(this.timeout);
  //   anime.set(el, { scale: 1 });
  //   var pad = padding || 0;
  //   var parentEl = document.getElementsByClassName('animation-wrapper');
  //   setTimeout(() => {
  //     var elOffsetWidth = el.offsetWidth - pad;
  //     var parentOffsetWidth = parentEl[0].clientWidth;
  //     var ratio = parentOffsetWidth / elOffsetWidth;
  //     this.timeout = setTimeout(anime.set(el, { scale: ratio }), 10);
  //   }, 500);
  // }
  getManagerTournaments() {
    this.db.collection('newTournaments').get().then(res => {
      this.tournaments = [] 
      res.forEach(tourns => {
        this.db.collection('newTournaments').doc(tourns.id).collection('teamApplications').where('TeamObject.uid', '==', this.loggedInUser.uid).where('status', '==', 'paid').get().then(snap => {
          
          if (snap.size > 0) {
            this.skeleton = []
            console.log('cealr skel');
            
            snap.forEach(doc => {
              if (doc.exists) {
                this.tournaments.push(tourns.data())
              }
            })
          } else {
            this.skeleton = [1,1]
          }
        })
      })
    })
  }
  getVendorTournaments() {
    this.db.collection('newTournaments').get().then(res => {
      this.vendorTournaments = []
      res.forEach(tourns => {
        this.db.collection('newTournaments').doc(tourns.id).collection('vendorApplications').where('uid', '==', this.loggedInUser.uid).get().then(snap => {
         
          if (res.size > 0 ) {
            this.skeleton = []
            snap.forEach(doc => {
              if (doc.exists) {
                this.vendorTournaments.push(tourns.data())
              }
            })
          } else {
            this.skeleton = [1,1]
          }
        })
      })
    })
  }
  // sphereAnimation = (() => {

  //   var sphereEl = document.getElementsByClassName('sphere');
  //   var spherePathEls = sphereEl

  //   var hasStarted = false;
  //   var aimations = [];
  //   let sphereGradient = document.getElementsByClassName('sphereGradient')
  //   this.fitElementToParent(sphereEl, 10);
  //   setTimeout(() => {
  //     var pathLength = spherePathEls[0].childNodes.length;

  //     let breathAnimation = anime({
  //       begin: () => {
  //         for (var i = 0; i < pathLength; i++) {
  //           aimations.push(anime({
  //             targets: spherePathEls[0].childNodes[i],
  //             stroke: { value: ['rgb(5, 166, 107)', 'rgb(5, 166, 107)'], duration: 500 },
  //             translateX: [2, -4],
  //             translateY: [2, -4],
  //             easing: 'easeOutQuad',
  //             autoplay: false
  //           }));
  //         }
  //       },
  //       update: (ins) => {
  //         aimations.forEach((animation, i) => {
  //           var percent = (1 - Math.sin((i * .35) + (.0022 * ins.currentTime))) / 2;
  //           animation.seek(animation.duration * percent);
  //         });
  //       },
  //       duration: Infinity,
  //       autoplay: false
  //     });

  //     var introAnimation = anime.timeline({
  //       autoplay: false
  //     })
  //       .add({
  //         targets: sphereEl,
  //         strokeDashoffset: {
  //           value: [anime.setDashoffset, 0],
  //           duration: 3900,
  //           easing: 'easeInOutCirc',
  //           delay: anime.stagger(190, { direction: 'reverse' })
  //         },
  //         duration: 2000,
  //         delay: anime.stagger(60, { direction: 'reverse' }),
  //         easing: 'linear'
  //       }, 0);

  //     var shadowAnimation = anime({
  //       targets: '#sphereGradient',
  //       x1: '25%',
  //       x2: '25%',
  //       y1: '0%',
  //       y2: '75%',
  //       duration: 30000,
  //       easing: 'easeOutQuint',
  //       autoplay: false
  //     }, 0);

  //     introAnimation.play();
  //     breathAnimation.play();
  //     shadowAnimation.play();

  //   }, 500);


  // })();
  back() {
    this.router.navigateByUrl('home')
  }
  async signout() {
    const alerter = await this.alertCtrl.create({
      header: 'Sign Out',
      message: "You're signing out, proceed?",
      buttons: [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          firebase.auth().signOut().then(() => {
            this.router.navigateByUrl('tabs/home').catch(err => {
            })
          }).catch(err => {
          })
        }
      }]
    })
    alerter.present()

  }
  openEdit(cmd) {

    switch (cmd) {
      case 'open':
        this.editMode = true
          this.renderer.setStyle(this.editProfile[0],'display','block')
        break;  
        case 'close':
          this.editMode = false
          setTimeout(() => {
            this.renderer.setStyle(this.editProfile[0],'display','none')
          }, 500);
          break;
    }
  }
  async edit(form) {
    
    let loader = await this.loadingCtrl.create({
      message: 'Updating'
    })
    await loader.present()
    this.db.collection('members').doc(firebase.auth().currentUser.uid).update({
      form: form,
      profileImage: this.profile.profileImage
    }).then(async res => {
      this.openEdit('close')
      await loader.dismiss()
      let toaster = await this.toastCtrl.create({
        message: 'Success',
        duration: 2000,
        buttons: [{
          icon: 'checkmark',
          role: 'cancel'
        }]
      })
      toaster.present()
    }).catch(async err => {
      this.openEdit('close')
      let alerter = await this.alertCtrl.create({
        header: 'Oops!',
        message: err.message,
        buttons: [
          {
            text: 'Okay',
            role: 'cancel'
          }
        ]
      })
     await alerter.present()
    })
  }
  //   getParticipatingTournaments(){
  // this.db.collection('newTournaments').where('approved','==','true').onSnapshot(res =>{
  //   this.participatingTourn = []
  //   res.forEach(doc =>{
  //     this.db.collection('newTournaments').doc(doc.id).collection('teamApplications').where('uid', '==', this.loggedInUser.uid).where('status','==','paid').onSnapshot(docx =>{

  //        if(docx.size>0) {
  //         this.participatingTourn.push(doc.data())
  //       

  //        }
  //     })

  //   })
  // })
  //   }
}