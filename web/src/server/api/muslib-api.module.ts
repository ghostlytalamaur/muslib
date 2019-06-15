import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MuslibApi } from './server-api';

@NgModule({
  imports: [HttpClientModule],
  providers: [MuslibApi]
})
export class MuslibApiModule {}
