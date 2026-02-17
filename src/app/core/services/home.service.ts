import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly httpClient=inject(HttpClient);

  getHomeData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/Home`);
  }

  getAllHomeData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/Home/GetAll`);
  }

  updateHome(data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/Home/update`,data);
  }

}
