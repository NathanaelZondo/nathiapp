import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
})
export class AddPlayerPage implements OnInit {
  players: any = []
  arr: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 9]
  date
  viewPlayer = {} as any
  selectedId = null
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
  editMode = false
  editForm = document.getElementsByClassName('dFH')
  buttonChange = 'add'
  addPlayerForm: FormGroup;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  isuploading: false
  uploadprogress = 0;
  loadingProcess = false;
  imageProgressText = 'Upload Image'
  logoImage
  GJerseyImage
  TjerseyImage
  counter: number;
  documentID

  position = [
    { value: 'Goalkeeper', label: '1 Goalkeeper' },
    { value: 'Right Fullback', label: '2 Right Fullback' },
    { value: 'Left Fullback', label: '3 Left Fullback' },
    { value: 'Center Back', label: '4 Center Back' },
    { value: 'Center Back (Sweeper)', label: '5 Center Back(Sweeper)' },
    { value: 'Defending/Holding Midfielder', label: '6 Defending/Holding Midfielder' },
    { value: 'Right Midfielder/Winger', label: '7 Right Midfielder/Winger' },
    { value: 'Central/Box-to-Box Midfielder', label: '8 Central/Box-to-Box Midfielder' },
    { value: 'Striker', label: '9 Striker' },
    { value: 'Attacking Midfielder/Playmaker', label: '10 Attacking Midfielder/Playmaker' },
    { value: 'Left Midfielder/Wingers', label: '11 Left Midfielder/Wingers' }];
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
  dater = null
  constructor(
    private formBuilder: FormBuilder,
    private camera: Camera,
    public loadingController: LoadingController,
    private router: Router,
    public toastController: ToastController,
    public renderer: Renderer2,
    public navctrl: NavController) {

    let v = new Date
    this.date = v.getFullYear() - 8
    this.addPlayerForm = this.formBuilder.group({
      DOB: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
      previousTeam: new FormControl('', Validators.required),
      height: new FormControl('', Validators.compose([Validators.required])),
      playerPosition: new FormControl('', Validators.compose([Validators.required])),
      playerNumber: new FormControl('', Validators.compose([Validators.required,Validators.max(100)])),
      //  Achievements: new FormControl('', Validators.compose([Validators.required])), 
      Achievements: this.formBuilder.array([
        this.formBuilder.control('')
      ])
    });

  }
  viewInfo(p, i) {
    this.selectedId = i
    this.viewPlayer = p
    console.log(p, this.selectedId)
  }
  getTeam() {

    let obj = {
      docid: null,
      docdata: null
    }
    this.db.collection('Teams').doc(firebase.auth().currentUser.uid).get().then(res => {
      if (res.exists) {
        console.log(res.data());

      }
      this.db.collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').onSnapshot(res => {
        this.players = []
        
        if (!res.empty) {
          this.arr = []
          res.forEach(doc => {
            obj = {
              docid: doc.id,
              docdata: doc.data()
            }
            this.players.push(obj)
            console.log('players', this.players);

            // this.isPlayer = true
          })
          this.viewPlayer = this.players[0]
          console.log(this.viewPlayer)
        }
      })
    })
  }
  back() {
    this.navctrl.navigateBack('tabs/manageTeam')
  }
  get Achievements() {
    return this.addPlayerForm.get('Achievements') as FormArray
  }
  addNew() {
    this.Achievements.push(this.formBuilder.control(''));
  }
  add() {
    this.dFH('open')
    this.buttonChange = 'add'
    this.editMode = true
  }
  close() {
    this.addPlayerForm.reset()
    this.dFH('close')
    this.buttonChange = 'add'
    this.editMode = false
  }
  edit(i) {
    this.dFH('open')
    this.editMode = true
    console.log('ccc', i);
    this.buttonChange = 'edit'
    this.documentID = i.docid
    this.playerNode.fullName = i.docdata.fullName
    this.playerNode.DOB = i.docdata.DOB
    this.playerNode.height = i.docdata.height
    this.playerNode.playerPosition = i.docdata.playerPosition
    this.playerNode.previousTeam = i.docdata.previousTeam
    this.playerNode.playerNumber = i.docdata.playerNumber
    this.playerNode.palyerImage = i.docdata.palyerImage
  }
  remove(index) {
    console.log(this.addPlayerForm.get('Achievements'));

    this.Achievements.removeAt(index)
  }
  dFH(cmd) {
    switch (cmd) {
      case 'open':
        this.renderer.setStyle(this.editForm[0],'display','flex');
        break;
        case 'close':
          setTimeout(() => {
            this.renderer.setStyle(this.editForm[0],'display','none')
          }, 500);
          break;
    }
  }
  async editPlayer() {
    this.loadingProcess = true;
    const load = await this.loadingController.create({
      message: 'Creating Your Player..'
    });
    const user = this.db.collection('Teams').doc(firebase.auth().currentUser.uid).collection('Players').doc(this.documentID).set(this.playerNode)

    // upon success...
    user.then(async () => {
      this.editMode = false
      this.dFH('close')
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
    this.dFH('close')
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


  //Functions to upload images
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
  done() {
    this.buttonChange = 'add'
    this.editMode = false
  }
  ngOnInit() {

    this.getTeam()
  }
}
