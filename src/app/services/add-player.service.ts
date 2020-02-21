import { ModalController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { PlayerAddPage } from '../player-add/player-add.page';

@Injectable({
  providedIn: 'root'
})
export class AddPlayerService {
  addPlayerModal
  constructor(public modalCtrl: ModalController) { }
  async add() {
    this.addPlayerModal = await this.modalCtrl.create({
      component: PlayerAddPage
    })
    await this.addPlayerModal.present()
  }
  async close() {

    await this.addPlayerModal.dismiss()
  }
}
