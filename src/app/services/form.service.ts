import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FormService {

  constructor(private _httpClient: HttpClient) { }

  getState() {
    return this._httpClient.get(`http://api.minebrat.com/api/v1/states`)
  }

  getCity(stateid: number) {
    return this._httpClient.get(`http://api.minebrat.com/api/v1/states/cities/${stateid}`)
  }

}
