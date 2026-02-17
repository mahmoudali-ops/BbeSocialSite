import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AboutteamService {

  private readonly httpClient=inject(HttpClient);

  getaboutteamData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/AboutTeam/GetAboutTeam`);
  }

  
  createaboutteam(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.BaseUrl}/api/AboutTeam`,data);
  }
  updateaboutteame(id:number,data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/AboutTeam/update/${id}`,data);
  }
  
  getAllDetaildedaboutteam(id:number|null):Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/AboutTeam/GetAll/${id}`);
  }

  deleteaboutteam(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/AboutTeam/delete/${id}`);
  }




}
