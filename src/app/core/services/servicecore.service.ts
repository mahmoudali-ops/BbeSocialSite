import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicecoreService {

private readonly httpClient=inject(HttpClient);

  getContactData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/ServiceCore`);
  }

  createServiceCore(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.BaseUrl}/api/ServiceCore`,data);
  }
  updateServiceCore(id:number,data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/ServiceCore/update/${id}`,data);
  }
  
  getAllDetaildedServiceCore(id:number|null):Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/ServiceCore/GetAll/${id}`);
  }

  deleteServiceCore(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/ServiceCore/delete/${id}`);
  }



}
