import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private readonly httpClient=inject(HttpClient);

  getAllDestnation():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/Price`);
  }
  
}
