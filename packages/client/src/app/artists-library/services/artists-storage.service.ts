import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { IdHolder } from '../../models/id-holder';
import { ArtistEntity, createArtistEntity } from '../store/artist.entity';
import { FireEntityService } from '../store/ngrx/fire-entity.service';
import { ImagesStorage } from './images-storage.service';

interface FireArtist {
  name: string;
  mbid?: string;
  imageId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtistsStorageService extends FireEntityService<ArtistEntity, FireArtist> {

  constructor(
    authService: AuthService,
    fireStore: AngularFirestore,
    private readonly imgStorage: ImagesStorage
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

  updateArtist(artist: Partial<ArtistEntity> & IdHolder): Promise<void> {
    const data: Partial<FireArtist> = {};
    if (artist.name) {
      data.name = artist.name;
    }
    if (artist.mbid) {
      data.mbid = artist.mbid;
    }
    return this.updateEntity(artist.id, data);
  }

  protected createEntity(userId: string, id: string, data: FireArtist): ArtistEntity {
    return createArtistEntity(id, data.name, data.imageId, data.mbid);
  }
}
