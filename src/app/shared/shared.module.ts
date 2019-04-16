import {NgModule} from '@angular/core';
import {AppCtxMatMenuDirective} from './context-menu-trigger';
import {MatMenuModule} from '@angular/material';

@NgModule({
  imports: [
    MatMenuModule
  ],
  exports: [
    AppCtxMatMenuDirective
  ],
  declarations: [
    AppCtxMatMenuDirective
  ]
})
export class SharedModule {}
