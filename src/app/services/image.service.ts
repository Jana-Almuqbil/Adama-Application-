import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageData: string | null = null;

  constructor(private navCtrl: NavController) {}

  setImage(data: string) {
    this.imageData = data;
  }

  getImage(): string | null {
    return this.imageData;
  }

  clearImage() {
    this.imageData = null;
  }

  async takePhotoFromMenu() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    if (image?.dataUrl) {
      this.setImage(image.dataUrl);
      this.navCtrl.navigateForward('/photo', {
        queryParams: {
          selectedImage: image.dataUrl
        }
      });
    }
  }
}
