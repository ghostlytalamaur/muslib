import { Directive, HostListener, Input } from '@angular/core';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLink]'
})
export class RouterLinkStubDirective {
  @Input('routerLink')
  linkParams: string;

  navigatedUrl: string;

  @HostListener('click')
  onClick(): void {
    this.navigatedUrl = this.linkParams;
  }
}
