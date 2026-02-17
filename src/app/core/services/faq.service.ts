import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

 private readonly httpClient=inject(HttpClient);

  getFaqData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/FAQ`);
  }


  updateFaq(id:number,data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/FAQ/update/${id}`,data);
  }
  
  getAllFaq(id:number|null):Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/FAQ/GetAll/${id}`);
  }

  createFaq(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.BaseUrl}/api/FAQ`,data);
  }


  deleteFaq(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/FAQ/delete/${id}`);
  }


}
