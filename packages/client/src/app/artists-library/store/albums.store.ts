import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { AlbumEntity } from './album.entity';

export interface AlbumsState extends EntityState<AlbumEntity> {}

const initialState: AlbumsState = {};

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'albums' })
export class AlbumsStore extends EntityStore<AlbumsState> {

  constructor() {
    super(initialState);
  }
}
