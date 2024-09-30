import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  generateCryptoId(length: number = 16) {
    const array = new Uint8Array(length / 2);
    crypto.getRandomValues(array);
    return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join('');
  }

  compareDate(date: any, secondDate: any) {
    let date1 = new Date(date);
    let date2 = new Date(secondDate);

    let sameDate = date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    return sameDate
  }
}
