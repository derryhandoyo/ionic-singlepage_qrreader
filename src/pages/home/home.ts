import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ToastController ,LoadingController,AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public toastCtrl: ToastController,public alertCtrl: AlertController,public navCtrl: NavController,private qrScanner: QRScanner,private loadingCtrl: LoadingController,private iab: InAppBrowser) {

  }

  scanQrcode(){

    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1500
    });
    loader.present();

    this.qrScanner.show().then((data: QRScannerStatus)=> {
      this.showCamera();
      // console.log('datashowing', data.showing);

      let scanSub = this.qrScanner.scan().subscribe((text:string)=>{
      // alert("Scanned something : " + text);
       const browser = this.iab.create(text,  '_blank', 'location=no,toolbar=no');
        
        browser.on('loadstop').subscribe(event => {
          // browser.insertCSS({ code: "body{color: red;" });
       });

        this.qrScanner.hide();
        scanSub.unsubscribe();
        this.hideCamera();
      });

    }, err => {
      this.hideCamera();
    });
  }

  showCamera(){
    const confirm = this.alertCtrl.create({
      title: 'Starting Camera?',
      message: 'Hold your camera over the QRcode to scan',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // console.log('Disagree clicked');
            const toast = this.toastCtrl.create({
              message: 'Scanning cancelled by user',
              duration: 3000
            });
            toast.present();
            this.hideCamera(); 
          }
        },
        {
          text: 'Agree',
          handler: () => {
            // console.log('Agree clicked');
            (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
          }
        }
      ]
    });
    confirm.present();
  }


  hideCamera(){
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

}
