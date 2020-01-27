import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
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
    teamManagerInfo: null,
    managerEmail : '',
    managerName : ''
  }
  loaderHolder = null
  addTeamForm: FormGroup;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  isuploading: false
  uploadprogress = 0;
  logoImage =null
  logoProgress = 0
  GJerseyImage =null
  jerseyProgress = 0
  TjerseyImage=null
  teamProgress = 0
  isEditing = false;
  userObj = {}
  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera ,
    public loadingController: LoadingController,
    private router: Router,
    public toastController: ToastController,
    public passServie : PassInformationServiceService,
     private activatedRoute: ActivatedRoute ) {
    this.addTeamForm = this.formBuilder.group({
      teamName: new FormControl('', Validators.required),
      // location: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
      coachName: new FormControl('', Validators.required),
      region: new FormControl('', Validators.compose([Validators.required])),
      tel: new FormControl('', Validators.compose([Validators.required])),

    });
  }

  ngOnInit() { 
    this.getMember();
    this.activatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.isEditing = this.router.getCurrentNavigation().extras.state.isEditing
        this.teamNode = this.router.getCurrentNavigation().extras.state.data
        console.log(this.isEditing, this.teamNode);
      }
    });
   }
   getMember(){
     firebase.auth().onAuthStateChanged( user =>{
       if(user){
         this.db.collection('members').doc(user.uid).get().then( doc =>{
          if(doc.exists){
            this.teamNode.managerEmail = doc.data().form.email
            this.teamNode.managerName = doc.data().form.fullName
          }
         })
       }
     })
   }
  async createTeam(addTeamForm: FormGroup): Promise<void> {

if (!addTeamForm.valid) {
      addTeamForm.value
    }
    else  {
      // load the profile creation process
      if (this.isEditing) {
       this.loaderHolder = await this.loadingController.create({
          message: 'Editing Your Team..'
        });
        this.loaderHolder.present();
      } else {
        this.loaderHolder  = await this.loadingController.create({
        message: 'Creating Your Team..'
      });
      this.loaderHolder.present();
      }
      
      
      parseInt(this.teamNode.tel)
      // this.teamNode.teamManagerInfo = this.userObj
      // this.teamNode.managerEmail = this.userObj.form.email
      const user = this.db.collection('Teams').doc(firebase.auth().currentUser.uid).set(this.teamNode)
      
      // upon success...
      user.then(async() => {
        this.router.navigateByUrl('tabs')
        const toast = await this.toastController.create({
          message: 'Success.',
          duration: 2000,
        });
        toast.present();
     
        this.loaderHolder.dismiss();

        // catch any errors.
      }).catch(async err => {
        const toast =  await this.toastController.create({
          message: 'Error creating Team.',
          duration: 2000
        })
        toast.present();

        this.loaderHolder.dismiss();
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
        this.logoProgress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.teamLogo = downUrl;
          console.log('Image downUrl', downUrl);
          this.logoProgress =0
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
        this.teamProgress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.teamJerseyIMG = downUrl;
          console.log('Image downUrl', downUrl);
          this.teamProgress =0

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
        this.jerseyProgress = progress;
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.teamNode.goalKeeperJerseyIMG = downUrl;
          console.log('Image downUrl', downUrl);
          this.jerseyProgress = 0
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
    
    this.router.navigateByUrl('tabs/manageTeam')
    this.isEditing  = false
  }
}