import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PassInformationServiceService } from 'src/app/service/pass-information-service.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.page.html',
  styleUrls: ['./add-team.page.scss'],
})
export class AddTeamPage implements OnInit {
  teamNode = {
    teamName: '',
    coachName: '',
    region: '',
    tel: '',
    // userUID: firebase.auth().currentUser.uid,
    DateCreated: new Date,
    teamLogo: '',
    teamJerseyIMG: '',
    goalKeeperJerseyIMG: '',
    uid: '',
    teamManagerInfo: null,
    managerEmail: '',
    managerName: ''
  }
  loaderHolder = null
  addTeamForm: FormGroup;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  isuploading: false
  uploadprogress = 0;

  logoImage = null
  logoText = 'Upload Image'
  logoProgress = 0

  GJerseyImage = null
  jerseyProgress = 0
  gJerseyText = 'Upload Image'

  TjerseyImage = null
  teamProgress = 0
  tJerseyText = 'Upload Image'

  isEditing = false;
  teamExists = false
  userObj = {}
  validation_messages = {
    'teamName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Name must not contain numbers or special characters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'coachName': [
      { type: 'required', message: 'Location is required.' },
      { type: 'minlength', message: 'Location must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Location cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Location must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Location has already been taken.' }
    ],
    'region': [
      { type: 'required', message: 'Team region is required.' }
    ],
    'tel': [
      { type: 'required', message: 'Contact details are required.' }
    ],
  };
  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    public loadingController: LoadingController,
    private router: Router,
    public toastController: ToastController,
    public passServie: PassInformationServiceService,
    private activatedRoute: ActivatedRoute,
    private nav: NavController,
    public splashScreen: SplashScreen, ) {
    this.addTeamForm = this.formBuilder.group({
      teamName: new FormControl('', Validators.required),
      // location: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
      coachName: new FormControl('', Validators.required),
      region: new FormControl('', Validators.compose([Validators.required])),
      tel: new FormControl('', Validators.compose([Validators.required])),

    });
  }


  getMember() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.db.collection('members').doc(user.uid).get().then(doc => {
          if (doc.exists) {
            this.teamNode.managerEmail = doc.data().form.email
            this.teamNode.managerName = doc.data().form.fullName
            console.log(this.teamNode);

          }
        })
      }
    })
  }
  async createTeam(addTeamForm: FormGroup): Promise<void> {

    if (!addTeamForm.valid) {
      addTeamForm.value
    }
    else {
      // load the profile creation process
      if (this.isEditing) {
        this.loaderHolder = await this.loadingController.create({
          message: 'Editing Your Team..'
        });
        this.loaderHolder.present();
      } else {
        this.loaderHolder = await this.loadingController.create({
          message: 'Creating Your Team..'
        });
        this.loaderHolder.present();
      }

      parseInt(this.teamNode.tel)
      // this.teamNode.teamManagerInfo = this.userObj
      // this.teamNode.managerEmail = this.userObj.form.email
      const user = this.db.collection('Teams').doc(firebase.auth().currentUser.uid).set(this.teamNode)

      // upon success...
      user.then(async () => {
        if (this.isEditing) {
          this.router.navigateByUrl('add-player')
        } else {
          this.router.navigateByUrl('add-player')
        }

        const toast = await this.toastController.create({
          message: 'Success.',
          duration: 2000,
        });
        toast.present();

        this.loaderHolder.dismiss();

        // catch any errors.
      }).catch(async err => {
        const toast = await this.toastController.create({
          message: 'Error creating Team.',
          duration: 2000
        })
        toast.present();

        this.loaderHolder.dismiss();
      })
    }
  }
  multiply(a: number, b: number) {
    return a + b;
  }
  //Functions to upload images
  async selectLogoImage() {
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
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;
      if (image) {
        this.teamNode.teamLogo = ''
      }
      this.logoImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Teams-Logo-image/' + firebase.auth().currentUser.uid + filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.logoProgress = progress;
        // upload progress state
        if (progress > 0) {
          this.logoText = 'Uploading...'
        } else if (progress > 50) {
          this.logoText = 'Halfway There...'
        } else if (progress == 100) {
          this.logoText = 'Finnishing Upload'
        }
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.teamLogo = downUrl;
          this.logoText = 'Done'
          console.log('Image downUrl', downUrl);
          this.logoProgress = 0
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }

  async teamJersey() {

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
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;
      if (image) {
        this.teamNode.teamJerseyIMG = ''
      }
      this.TjerseyImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Teams-Jersey-image/' + firebase.auth().currentUser.uid + filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.teamProgress = progress;
        if (progress > 0) {
          this.tJerseyText = 'Uploading...'
        } else if (progress > 50) {
          this.tJerseyText = 'Halfway There...'
        } else if (progress == 100) {
          this.tJerseyText = 'Finnishing Upload'
        }
        if (progress == 100) {
          this.isuploading = false;
        }
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.teamJerseyIMG = downUrl;
          this.tJerseyText = 'Done'
          console.log('Image downUrl', downUrl);
          this.teamProgress = 0

        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }
  async GoalKeeperJersey() {
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
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;
      if (image) {
        this.teamNode.goalKeeperJerseyIMG = ''
      }
      this.GJerseyImage = image;

      const filename = Math.floor(Date.now() / 1000);
      let file = 'Teams-Jersey-image/' + firebase.auth().currentUser.uid + filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.jerseyProgress = progress;
        if (progress > 0) {
          this.gJerseyText = 'Uploading...'
        } else if (progress > 50) {
          this.gJerseyText = 'Halfway There...'
        } else if (progress == 100) {
          this.gJerseyText = 'Finnishing Upload'
        }
        if (progress == 100) {
          this.isuploading = false;
        }
        if (progress == 100) {
          this.isuploading = false;
        }
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.gJerseyText = 'Done'
          this.teamNode.goalKeeperJerseyIMG = downUrl;
          console.log('Image downUrl', downUrl);
          this.jerseyProgress = 0
        })
      })
    }, err => {

      console.log("Something went wrong: ", err);
    })
  }


  back() {

    this.router.navigateByUrl('tabs/manageTeam')
    this.isEditing = false
  }
  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.teamNode.uid = user.uid
        this.db.collection('Teams').doc(this.teamNode.uid).get().then(team => {
          if (team.exists) {
            this.teamExists = true
          }
          setTimeout(() => {
            this.splashScreen.hide()
          }, 3000);
        })
      }
    })

    this.getMember();
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.isEditing = this.router.getCurrentNavigation().extras.state.isEditing
        this.teamNode = this.router.getCurrentNavigation().extras.state.data
        console.log(this.isEditing, this.teamNode);
      }
    });
  }
}