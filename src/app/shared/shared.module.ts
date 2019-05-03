import {NgModule} from '@angular/core';
import {AppCtxMatMenuDirective} from './context-menu-trigger';
import {MatMenuModule} from '@angular/material';
import {ImageSelectorComponent} from './image-selector/image-selector.component';

@NgModule({
  imports: [
    MatMenuModule
  ],
  exports: [
    AppCtxMatMenuDirective,
    ImageSelectorComponent
  ],
  declarations: [
    AppCtxMatMenuDirective,
    ImageSelectorComponent
  ]
})
export class SharedModule {}
