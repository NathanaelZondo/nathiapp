import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
@Component({
  selector: 'app-no-network',
  templateUrl: './no-network.page.html',
  styleUrls: ['./no-network.page.scss'],
})
export class NoNetworkPage implements OnInit {
  uploadprogress = 100
  text = "Closing App"
  netStatus = false
  constructor( private router : Router, private network: Network) { }

  ngOnInit() {
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.netStatus = true
        this.router.navigateByUrl('tabs')
        if (this.network.type === 'wifi') {
  
        }
      }, 3000);
    },err => {
      console.log(err);
    });

    console.log(connectSubscription);
    
    let interval = setInterval(()=>{
      // if the interval is zero then exit the app it 
      
      if (this.netStatus == true) {
        console.log('secs');
        clearInterval(interval)
      } else if(this.uploadprogress == 0) {
        clearInterval(interval)
        navigator['app'].exitApp();
      }
      this.uploadprogress = this.uploadprogress - 10
      console.log("Oooo Yeaaa!");
      

    }, 1000);//run this thang every 1 second
  }

}
