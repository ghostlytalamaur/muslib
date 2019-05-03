import {Component, OnInit} from '@angular/core';
import {StatusService} from '../services/status.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './app-nav-bar.component.html',
  styleUrls: ['./app-nav-bar.component.scss']
})
export class AppNavBarComponent implements OnInit {

  constructor(
    readonly statusService: StatusService
  ) {
  }

  ngOnInit(): void {
  }

}
