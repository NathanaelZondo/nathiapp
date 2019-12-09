import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterFormComponent } from '../components/register-form/register-form.component';



@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule], declarations: [RegisterFormComponent], exports: [RegisterFormComponent], entryComponents: [RegisterFormComponent] 
})
export class AuthModule { }
