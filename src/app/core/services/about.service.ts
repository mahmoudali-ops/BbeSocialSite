import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private readonly httpClient=inject(HttpClient);

  getAboutData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/About/GetAbout`);
  }

  getAllAboutData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/About/GetAll`);
  }

  updateCareer(data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/About/update`,data);
  }
  



}
