import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatMenuModule,
  MatRadioModule,
  MatTooltipModule
} from '@angular/material';
import { AppCtxMatMenuDirective } from './context-menu-trigger';
import { ImageSelectorComponent } from './image-selector/image-selector.component';
import { ListDialogComponent } from './list-dialog/list-dialog.component';
import { LogPipe } from './log.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatRadioModule,
    MatDialogModule
  ],
  exports: [AppCtxMatMenuDirective, ImageSelectorComponent],
  declarations: [
    AppCtxMatMenuDirective,
    ImageSelectorComponent,
    LogPipe,
    ListDialogComponent
  ],
  entryComponents: [ListDialogComponent]
})
export class SharedModule {}
