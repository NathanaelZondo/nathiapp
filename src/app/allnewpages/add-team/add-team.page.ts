import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PassInformationServiceService } from 'src/app/service/pass-information-service.service';

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
    DateCreated : new Date,
    teamLogo: '',
    teamJerseyIMG: '',
    goalKeeperJerseyIMG: '',
    uid: firebase.auth().currentUser.uid,
    teamManagerInfo: null
  }
  addTeamForm: FormGroup;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  isuploading: false
  uploadprogress = 0;
  logoImage
  GJerseyImage
  TjerseyImage
  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera ,
    public loadingController: LoadingController,
    private router: Router,
    public toastController: ToastController,
    public passServie : PassInformationServiceService ) {
    this.addTeamForm = this.formBuilder.group({
      teamName: new FormControl('', Validators.required),
      // location: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
      coachName: new FormControl('', Validators.required),
      region: new FormControl('', Validators.compose([Validators.required])),
      tel: new FormControl('', Validators.compose([Validators.required])),

    });
  }

  ngOnInit() { }
  async createTeam(addTeamForm: FormGroup): Promise<void> {

if (!addTeamForm.valid) {
      addTeamForm.value
    }
    else  {
      // load the profile creation process
      const load = await this.loadingController.create({
        message: 'Creating Your Team..'
      });
      load.present();
      
      parseInt(this.teamNode.tel)
      this.teamNode.teamManagerInfo = this.passServie.profile
      const user = this.db.collection('Teams').doc(firebase.auth().currentUser.uid).set(this.teamNode)
      
      // upon success...
      user.then(async() => {
        this.router.navigateByUrl('manage-team')
        const toast = await this.toastController.create({
          message: 'User Team added.',
          duration: 2000,

        });
        toast.present();
     
        load.dismiss();

        // catch any errors.
      }).catch(async err => {
        const toast =  await this.toastController.create({
          message: 'Error creating Team.',
          duration: 2000
        })
        toast.present();

        load.dismiss();
      })
    }
    
  
  }

  //Functions to upload images
  async selectLogoImage() {
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
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      this.logoImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Teams-Logo-image/' + firebase.auth().currentUser.uid + filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadprogress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.teamLogo = downUrl;
          console.log('Image downUrl', downUrl);


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
      targetHeight : 600,
      targetWidth : 600,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then(res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      this.TjerseyImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Teams-Jersey-image/' + firebase.auth().currentUser.uid + filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadprogress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.teamJerseyIMG = downUrl;
          console.log('Image downUrl', downUrl);


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
      targetHeight : 600,
      targetWidth : 600,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    await this.camera.getPicture(option).then(res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;

      this.GJerseyImage = image;



      const filename = Math.floor(Date.now() / 1000);
      let file = 'Teams-Jersey-image/' + firebase.auth().currentUser.uid + filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadprogress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.teamJerseyIMG = downUrl;
          console.log('Image downUrl', downUrl);


        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }  

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
  back() {
    this.router.navigateByUrl('home')
  }
}
