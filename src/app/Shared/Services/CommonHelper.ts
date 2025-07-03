import { Injectable } from '@angular/core';
import { UserResponseDto } from '../../Models/ResponseDto/UserResponseDto';
import { Toolbar } from 'ngx-editor';

@Injectable()

export class CommonHelper {

  constructor() { }
  public static CommonButtonClick(elementId: string) {
    document.getElementById(elementId)?.click();
  }
  // Pagination Number generated 
  public static generateNumbers(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  public static isValidNumber(input: string): boolean {
    const regex = /^\d{11}$/; // Matches exactly 11 digits
    return regex.test(input);
  }

  public static booleanConvert(booleanValue: any): boolean {
    if (booleanValue == "true") {
      return true
    }
    else if (booleanValue == "false") {
      return false
    } else if (booleanValue == true) {
      return true
    }
    else if (booleanValue == false) {
      return false
    } else {
      return true;
    }
  }

  public static GetUser(): UserResponseDto | null {
    let oUserResponseDto = new UserResponseDto();
    var user = localStorage.getItem("UserResponseDto");
    if (user != null) {
      oUserResponseDto = JSON.parse(user);
    }
    return oUserResponseDto;
  }

  public static GetToolBar(): Toolbar {
    let toolbar: Toolbar = [
      ['bold', 'italic'],
      ['underline', 'strike'],
      ['code', 'blockquote'],
      ['ordered_list', 'bullet_list'],
      [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ['link', 'image'],
      ['text_color', 'background_color'],
      ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];
    return toolbar;
  }

  public static getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  public static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  public static formatTime(time: string): any {
    if (!time || time === '') {
      return '00:00:00';
    }


    // Handle "HH:mm" format
    const parts = time.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:00`;
      }
    }
    return '00:00:00';
  }

}