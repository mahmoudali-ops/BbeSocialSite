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

}
