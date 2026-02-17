import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicefeatureService {

  private readonly httpClient=inject(HttpClient);

  getContactData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/ServiceFeature`);
  }

  createServiceFeature(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.BaseUrl}/api/ServiceFeature`,data);
  }
  updateServiceFeature(id:number,data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/ServiceFeature/update/${id}`,data);
  }
  
  getAllDetaildedServiceFeature(id:number|null):Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/ServiceFeature/GetAll/${id}`);
  }

  deleteServiceFeature(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/ServiceFeature/delete/${id}`);
  }




}
