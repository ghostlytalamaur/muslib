import { NgModule } from '@angular/core';
import { AppCtxMatMenuDirective } from './context-menu-trigger';
import {
  MatMenuModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { CommonModule } from '@angular/common';
import { LogPipe } from './log.pipe';

@NgModule({
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatTooltipModule],
  exports: [AppCtxMatMenuDirective, ImageSelectorComponent],
  declarations: [AppCtxMatMenuDirective, ImageSelectorComponent, LogPipe]
})
export class SharedModule {}
