import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage, public alertController: AlertController) { }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: 0,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then((imageData) => {
      // Add new photo to gallery
      this.photos.unshift({
        data: 'data:image/jpeg;base64,' + imageData
      });
      this.storage.set('photos', this.photos);
    }, (err) => {
      // Handle error
      console.log('Camera issue: ' + err);
    });
  }

  loadSaved() {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }

  async deletePhoto(photo) {
    // this.photos.splice(this.photos.indexOf(photo), 1);
    // this.storage.set('photos', this.photos);
    // this.presentAlertConfirm(photo);
    const alert = await this.alertController.create({
      header: 'Delete this photo?',
      message: 'Are you sure you want to delete this photo?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log(' ');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.photos.splice(this.photos.indexOf(photo), 1);
            this.storage.set('photos', this.photos);
          }
        }
      ]
    });

    await alert.present();
  }
}


class Photo {
  data: any;
}
