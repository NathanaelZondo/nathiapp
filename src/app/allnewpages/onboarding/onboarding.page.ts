import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router, ActivatedRoute } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import * as firebase from 'firebase';
import { Device } from '@ionic-native/device/ngx';
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('slides',{static: true}) slides : IonSlides
  activeSlide = 0
  hideNext = false
  slideOpts = {
    slidesPerView: 1,
    coverflowEffect: {
      rotate: 50,
      stretch: 10,
      depth: 50,
      modifier: 1,
      spaceBetween: 2,
      slideShadows: true,
    },
    on: {
      beforeInit() {
        const swiper = this;
  
        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
  
        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
  
           let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          // var rotateZ = 0
          let translateZ = -translate * Math.abs(offsetMultiplier);
  
           let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
          let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;
  
           // Fix for ultra small values
          if (Math.abs(translateX) < 0.001) translateX = 0;
          if (Math.abs(translateY) < 0.001) translateY = 0;
          if (Math.abs(translateZ) < 0.001) translateZ = 0;
          if (Math.abs(rotateY) < 0.001) rotateY = 0;
          if (Math.abs(rotateX) < 0.001) rotateX = 0;
  
           const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  
           $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
          if (params.slideShadows) {
            // Set shadows
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append($shadowBeforeEl);
            }
            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append($shadowAfterEl);
            }
            if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
            if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
          }
        }
  
         // Set correct perspective for IE10
        if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
          const ws = $wrapperEl[0].style;
          ws.perspectiveOrigin = `${center}px 50%`;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    }
  }
  constructor(public navCtrl: NavController,private router: Router, private activatedRoute: ActivatedRoute,private nativeStorage: NativeStorage,
    public splashScreen: SplashScreen, private device: Device) { }

  ngOnInit() {
    
    setTimeout(() => {
      this.splashScreen.hide()
    }, 3000);
    this.slides.lockSwipes(true)
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

      }
    
    });
  }
  getSlide(slide) {
    let index = this.slides.getActiveIndex().then(res => {
      console.log(res);
      this.activeSlide = res
    })
    this.slides.isEnd().then(res => {
      if (res==true) {
        console.log('will hide next');
        
     this.hideNext = true
   }
     
   })
  }
  nextSlide() {
    this.slides.lockSwipes(false)
    this.slides.slideNext(300, true).then(res=> {
      console.log(res);
      
    })
    this.slides.lockSwipes(true)
    this.slides.isEnd().then(res => {
       if (res==true) {
         console.log('will hide next');
         
      this.hideNext = true
    }
      
    })
   
  }
  skip() {
    this.slides.lockSwipes(false)
    this.slides.slideTo(4).then(()=>{})
    this.slides.lockSwipes(true)
  }
  // sign(page) {
    
  //   firebase.firestore().collection('DeviceUUID').add({ uid : this.device.uuid}).then(res => {
  //     console.log('On res');
      
  //     switch (page) {
  //       case 'up':
  //         this.navCtrl.navigateRoot('registerpage')
  //         break;
  //         case 'in':
  //           this.navCtrl.navigateRoot('login')
  //           break;
  //           case 'home':
  //           this.navCtrl.navigateRoot('tabs')
  //           break;
  //     }
  //   },err => {
  //     console.log('storage err', err);
      
  //     switch (page) {
  //       case 'up':
  //         this.navCtrl.navigateRoot('registerpage')
  //         break;
  //         case 'in':
  //           this.navCtrl.navigateRoot('login')
  //           break;
  //           case 'home':
  //           this.navCtrl.navigateRoot('tabs')
  //           break;
  //     }
      
  //   })

  // }
  sign(page){
    switch (page) {
      case 'up':
        this.navCtrl.navigateRoot('registerpage')
        break;
        case 'in':
          this.navCtrl.navigateRoot('login')
          break;
          case 'home':
          this.navCtrl.navigateRoot('tabs')
          break;
    }
  }
}
