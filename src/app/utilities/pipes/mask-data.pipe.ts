import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maskData' })
export class MaskDataPipe implements PipeTransform {

  transform(cardNumber: string, visibleDigits: number): any {
    if (cardNumber) {
      let maskedNumbers = cardNumber.slice(0, -visibleDigits);
      let visibleNumbers = cardNumber.slice(-visibleDigits);
      return maskedNumbers.replace(/./g, 'X') + visibleNumbers;
    }
  }

}
