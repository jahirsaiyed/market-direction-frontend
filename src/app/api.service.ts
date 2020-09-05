import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  localUrl="http://localhost:8080/v1/options";//?expiry=28/Apr/2016&date=28/Apr/2016";
  constructor(private http: HttpClient) { }

  getOptionsData(expiry : string, date: string) {
    return this.http.get(this.localUrl + "?expiry=" + expiry + "&date=" + date);
  }
}
