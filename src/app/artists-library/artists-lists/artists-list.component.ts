import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Artist} from '../../models/artist';
import {ArtistsService} from '../services/artists.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-artists-lists',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {

  artists$: Observable<Artist[]>;

  constructor(
    private service: ArtistsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.artists$ = this.service.getArtists();
  }

  deleteArtist(id: string): void {
    this.service.deleteArtist(id)
      .catch((err) => console.log('Cannot delete artist', err));
  }

  trackById(index: number, artist: Artist): string {
    return artist.id;
  }

  onClick(artist: Artist): void {
    this.router.navigate([artist.id], {relativeTo: this.route})
      .catch((err) => console.error('Cannot navigate to artist details.', err));
  }
}
