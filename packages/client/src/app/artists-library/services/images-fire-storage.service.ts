import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { createImage, Image, ImageThumbnails, ImageType } from '../../models/image';
import { AuthService } from '../../auth/auth.service';
import * as uuid from 'uuid';
import { FireEntityService } from '../store/ngrx/fire-entity.service';
import { AngularFirestore } from '@angular/fire/firestore';

interface ImageEntityData {
  path: string;
  thumbnails?: ImageThumbnails; // thumbnail size to path
}

@Injectable({
  providedIn: 'root'
})
export class ImagesFireStorage extends FireEntityService<Image, ImageEntityData> {

  constructor(
    private readonly fireStorage: AngularFireStorage,
    authService: AuthService,
    afs: AngularFirestore
  ) {
    super(afs, authService, 'images');
  }

  async uploadImage(image: File | string): Promise<string> {
    try {
      const user = this.authService.user;
      if (user && image instanceof File) {
        console.log('Uploading image to FireStorage');
        const uniqueId = uuid.v4();
        const path = `users/${user.uid}/images/${uniqueId}`;
        const entityId = await this.addEntity({ path });
        const imageRef = this.fireStorage.storage.ref(path);
        const snapshot = await imageRef.put(image, {
          contentType: image.type,
          customMetadata: { entity: this.getEntityPath(user.uid, entityId) }
        });

        const id = snapshot.ref.fullPath;
        console.log('Image uploaded to FireStorage. id =', id);
        return entityId;
      } else {
        return '';
      }
    } catch (err) {
      console.log('Error while uploading image.', err);
      return '';
    }
  }

  protected async createEntity(userId: string, id: string, data: ImageEntityData): Promise<Image> {
    const promises = [];
    promises.push(this.getImageUrl(data.path));
    if (data.thumbnails) {
      promises.push(this.getImageUrl(data.thumbnails.thumb300));
    }
    return Promise.all(promises)
      .then(([url, thumb300]) => {
        return createImage(ImageType.FireStorage, id, url, {
          thumb300
        });
      });
  }

  private getImageUrl(id: string): Promise<string> {
    console.log('Request image url for image', id);
    return this.fireStorage.storage
      .ref(id)
      .getDownloadURL()
      .catch(err => {
        console.log('Cannot get image url for id =', id, err);
        return '';
      });
  }
}
