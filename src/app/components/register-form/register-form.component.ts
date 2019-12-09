import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { UserCredential } from 'src/app/Models/user';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  public loading: HTMLIonLoadingElement;
  public authForm: FormGroup;
  @Input() actionButtonText: string;
  @Input() isPasswordResetPage = false;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.authForm = this.formBuilder.group({
      // phonenumber: ['', Validators.compose([Validators.required, Validators.maxLength.(10))],
      phonenumber: ['', Validators.maxLength(10)]
    });
  }

  ngOnInit() {}

  submitCredentials(authForm: FormGroup): void {
    if (!authForm.valid) {
      console.log('Form is not valid yet, current value:', authForm.value);
    } else {
      // this.showLoading();
      const credentials: UserCredential = {
        phonenumber: authForm.value.phonenumber,
     
      };
      this.formSubmitted.emit(credentials);
    }
  }

  // async showLoading(): Promise<void> {
  //   this.loading = await this.loadingCtrl.create();
  //   await this.loading.present();
  // }

  hideLoading(): Promise<boolean> {
    return this.loading.dismiss();
  }

  async handleError(error): Promise<void> {
    const alert = await this.alertCtrl.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }]
    });
    await alert.present();
  }

}
