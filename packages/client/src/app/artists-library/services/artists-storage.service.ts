import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { IdHolder } from '../../models/id-holder';
import { Artist, createArtist } from '../../models/artist';
import { FireEntityService } from '../store/ngrx/fire-entity.service';
import { createImageId, ImageType } from '../../models/image';
import { ImagesFireStorage } from './images-fire-storage.service';

interface FireArtist {
  name: string;
  mbid?: string;
  imageId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtistsStorageService extends FireEntityService<Artist, FireArtist> {

  constructor(
    authService: AuthService,
    fireStore: AngularFirestore,
    private readonly imgStorage: ImagesFireStorage
  ) {
    super(fireStore, authService, 'artists');
  }

  deleteArtist(docId: string): Promise<void> {
    return this.deleteEntity(docId);
  }

  async addArtist(name: string, image?: File | string): Promise<string> {
    let imageId = '';
    if (image) {
      imageId = await this.imgStorage.uploadImage(image);
    }
    return this.addEntity({ name, imageId });
  }

  updateArtist(artist: Partial<Artist> & IdHolder): Promise<void> {
    const data: Partial<FireArtist> = {};
    if (artist.name) {
      data.name = artist.name;
    }
    if (artist.mbid) {
      data.mbid = artist.mbid;
    }
    return this.updateEntity(artist.id, data);
  }

  protected createEntity(userId: string, id: string, data: FireArtist): Artist {
    const image = data.imageId ? createImageId(ImageType.FireStorage, data.imageId) : undefined;
    return createArtist(id, data.name, image, data.mbid);
  }
}
