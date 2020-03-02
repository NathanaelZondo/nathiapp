import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, ToastController, NavController, AlertController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { PlayerAddPage } from 'src/app/player-add/player-add.page';
@Component({
  selector: 'app-player-add',
  templateUrl: './player-add.page.html',
  styleUrls: ['./player-add.page.scss'],
})
export class PlayerAddPage implements OnInit {
  db = firebase.firestore();
  storage = firebase.storage().ref();
  addPlayerForm: FormGroup;
  date
  playerNode = {
    fullName: '',
    palyerImage: '',
    DOB: '',
    previousTeam: 'none',
    DateCreated: null,
    DateEdited: null,
    playerPosition: '',
    playerNumber: '',
    height: '',
    Achievements: []
  }
  achievementLimit = ['limit']
  uploadprogress = 0;
  loadingProcess = false;
  buttonChange = 'add'
  counter
  editMode = false
  documentID
  editValue
  position = [
    { value: '1.Goalkeeper', label: '1 Goalkeeper' },
    { value: '2.Right Fullback', label: '2 Right Fullback' },
    { value: '3.Left Fullback', label: '3 Left Fullback' },
    { value: '4.Center Back', label: '4 Center Back' },
    { value: '5.Center Back (Sweeper)', label: '5 Center Back(Sweeper)' },
    { value: '6.Defending/Midfielder', label: '6 Defending/Holding Midfielder' },
    { value: '7.Right Midfielder', label: '7 Right Midfielder/Winger' },
    { value: '8.Central/Midfielder', label: '8 Central/Box-to-Box Midfielder' },
    { value: '9.Striker', label: '9 Striker' },
    { value: '10.Attacking Midfielder', label: '10 Attacking Midfielder/Playmaker' },
    { value: '11.Left Midfielder', label: '11 Left Midfielder/Winger' }];
  validation_messages = {
    'fullName': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' },
      { type: 'maxlength', message: 'Name cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your Name must not contain numbers and special characters.' },
      // { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'previousTeam': [
      { type: 'required', message: 'previous Team is required.' },
      { type: 'minlength', message: 'previous Team must be at least 4 characters long.' },
      { type: 'maxlength', message: 'previous Team cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your previous Team must not contain numbers and special characters.' },
      { type: 'validUsername', message: 'Your previous Team has already been taken.' }
    ],
    'playerPosition': [
      { type: 'required', message: 'player Position is required.' }
    ],
    'height': [
      { type: 'required', message: 'height  is required.' }
    ],
    'playerNumber': [
      { type: 'required', message: 'Player jersey number is required.' },
    ],
    // 'Achievements': [
    //   { type: 'required', message: 'Achievements is required.' }
    // ],
  };
  TjerseyImage
  isuploading: false
  imageProgressText = 'Upload Image'
  editingPlayer = {} as any
  constructor(private formBuilder: FormBuilder,
    private camera: Camera,
    public loadingController: LoadingController,
    private router: Router,
    public toastController: ToastController,
    public renderer: Renderer2,
    public navctrl: NavController,
    public splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController, public navCtrl: NavController,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    let v = new Date
    this.date = v.getFullYear() - 8
    this.addPlayerForm = this.formBuilder.group({
      DOB: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
      previousTeam: new FormControl('', Validators.required),
      height: new FormControl('', Validators.compose([Validators.required])),
      playerPosition: new FormControl('', Validators.compose([Validators.required])),
      playerNumber: new FormControl('', Validators.compose([Validators.required, Validators.max(100)])),
      //  Achievements: new FormControl('', Validators.compose([Validators.required])), 
      Achievements: this.formBuilder.array([
        this.formBuilder.control('')
      ])
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.editingPlayer = this.router.getCurrentNavigation().extras.state.parms
        this.documentID = this.router.getCurrentNavigation().extras.state.parms.docid
console.log('se', );
this.buttonChange = this.router.getCurrentNavigation().extras.state.poo

        if (this.editingPlayer) {
          this.playerNode = {
            fullName: this.editingPlayer.docdata.fullName,
            palyerImage: this.editingPlayer.docdata.palyerImage,
            DOB: this.editingPlayer.docdata.DOB,
            previousTeam: this.editingPlayer.docdata.previousTeam,
            DateCreated: this.editingPlayer.docdata.DateCreated,
            DateEdited: new Date(),
            playerPosition: this.editingPlayer.docdata.playerPosition,
            playerNumber: this.editingPlayer.docdata.playerNumber,
            height: this.editingPlayer.docdata.height,
            Achievements: this.editingPlayer.docdata.Achievements
          }
          this.editingPlayer.docdata.Achievements.forEach(element => {
            this.Achievements.push(this.formBuilder.control(element));
          });
        }

      } else {
        console.log('No Player To edit');
        
      }
    });
  }
  get Achievements() {
    return this.addPlayerForm.get('Achievements') as FormArray
  }
  addNew() {
    this.achievementLimit.push('limit')
    this.Achievements.push(this.formBuilder.control(''));
  }
  remove(index) {
    this.achievementLimit.pop()
    console.log(this.addPlayerForm.get('Achievements'));

    this.Achievements.removeAt(index)
  }
  async editPlayer() {
    this.loadingProcess = true;
    const load = await this.loadingController.create({
      message: 'editing Your Player..'
    });
    const user = this.db.collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').doc(this.documentID).set(this.playerNode)
    // upon success...
    user.then(async () => {
      this.editMode = false
      this.buttonChange = 'add'
      this.loadingProcess = false;
      this.addPlayerForm.reset()
      console.log(this.addPlayerForm);

      this.playerNode = {
        fullName: '',
        palyerImage: '',
        DOB: '',
        previousTeam: '',
        DateCreated: null,
        DateEdited: null,
        playerPosition: '',
        height: '',
        Achievements: [],
        playerNumber: ''

      }
      this.router.navigateByUrl('add-player')
      const toast = await this.toastController.create({
        message: 'User Team added.',
        duration: 2000,

      });
      toast.present();
      load.dismiss();
      // catch any errors.
    }).catch(async err => {
      this.loadingProcess = false;
      const toast = await this.toastController.create({
        message: 'Error creating Team.',
        duration: 2000
      })
      toast.present();
      load.dismiss();
    })
  }
  async createTeam(addPlayerForm: FormGroup): Promise<void> {
    this.loadingProcess = true;
    if (!addPlayerForm.valid) {
      addPlayerForm.value
    }
    else {
      // load the profile creation process
      const load = await this.loadingController.create({
        message: 'Creating Your Player..'
      });
      load.present();
      this.counter = 0
      for (let x of this.Achievements.controls) {
        console.log("acheia", this.addPlayerForm.get(['Achievements', this.counter]).value);
        this.counter = this.counter + 1;
        this.playerNode.Achievements.push(x.value)
      }
      console.log('arr', this.playerNode.Achievements);

      parseInt(this.playerNode.height)
      this.playerNode.DateCreated = new Date;
      const user = this.db.collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').doc().set(this.playerNode)

      // upon success...
      user.then(async () => {
        this.buttonChange = 'add'
        this.editMode = false
        this.loadingProcess = false
        this.addPlayerForm.reset()
        this.playerNode = {
          fullName: '',
          palyerImage: '',
          DOB: '',
          previousTeam: '',
          DateCreated: null,
          DateEdited: null,
          playerPosition: '',
          height: '',
          Achievements: [],
          playerNumber: ''
        }
        this.router.navigateByUrl('add-player')
        const toast = await this.toastController.create({
          message: 'User Team added.',
          duration: 2000,

        });
        toast.present();
        load.dismiss();
        // catch any errors.
      }).catch(async err => {
        this.loadingProcess = false
        const toast = await this.toastController.create({
          message: 'Error creating Team.',
          duration: 2000
        })
        toast.present();
        load.dismiss();
      })
    }

  }
  async selectImage() {
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

      this.TjerseyImage = image;
      const filename = Math.floor(Date.now() / 1000);
      let file = 'Teams-Players-image/' + firebase.auth().currentUser.uid + filename + '.jpg';
      const UserImage = this.storage.child(file);

      const upload = UserImage.putString(image, 'data_url');
      upload.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.uploadprogress = progress;
        if (progress > 0) {
          this.imageProgressText = 'Uploading...'
        } else if (progress > 50) {
          this.imageProgressText = 'Halfway There...'
        } else if (progress == 100) {
          this.imageProgressText = 'Finnishing Upload'
        }
        if (progress == 100) {
          this.isuploading = false;
        }
      }, err => {
      }, () => {
        upload.snapshot.ref.getDownloadURL().then(downUrl => {
          this.imageProgressText = 'Done'
          this.playerNode.palyerImage = downUrl;
          console.log('Image downUrl', downUrl);
        })
      })
    }, err => {
      console.log("Something went wrong: ", err);
    })
  }
  close() {
    this.navCtrl.navigateBack('add-player')
  }
}
