import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.page.html',
  styleUrls: ['./errorpage.page.scss'],
})
export class ErrorpagePage implements OnInit {

  constructor(public NavCtrl: NavController) { }

  ngOnInit() {
  }
  back() {
    this.NavCtrl.navigateBack('home')
  }
}
