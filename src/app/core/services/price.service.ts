import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private readonly httpClient=inject(HttpClient);

  getAllPrice():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/Price`);
  }
  

  createPrice(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.BaseUrl}/api/Price`,data);
  }
  updatePrice(id:number,data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/Price/update/${id}`,data);
  }
  
  getAllDetaildPrice(id:number|null):Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/Price/GetAll/${id}`);
  }

  deletePrice(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/Price/delete/${id}`);
  }

}
