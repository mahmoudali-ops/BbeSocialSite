import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CareerService {

  private readonly httpClient=inject(HttpClient);

  getCareerData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/Career`);
  }


  createCareer(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.BaseUrl}/api/Career`,data);
  }
  updateCareer(id:number,data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/Career/update/${id}`,data);
  }
  
  getAllDetaildedCareer(id:number|null):Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/Career/GetAll/${id}`);
  }

  deleteCareer(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/Career/delete/${id}`);
  }

}
