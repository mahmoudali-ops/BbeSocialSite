import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocailelemntsService {

  private readonly httpClient=inject(HttpClient);

  getSocailData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/SocailElememts`);
  }

  updateSocailData(data:FormData):Observable<any>{
    return this.httpClient.put(`${environment.BaseUrl}/api/SocailElememts/update`,data);
  }

    logo:WritableSignal<string|null>=signal(null);
    facebookUrl:WritableSignal<string|null>=signal(null);
    instagramUrl:WritableSignal<string|null>=signal(null);
    email:WritableSignal<string|null>=signal(null);
  
  
    loadHomePage() {
      return this.getSocailData().subscribe(res => {
        this.logo.set(environment.BaseUrl+"/"+res.logo);
        this.facebookUrl.set(res.facebookUrl);
        this.instagramUrl.set(res.instagramUrl);
        this.email.set(res.email);
        console.log('reeeeeeeeees',res);
      });
    }

}
