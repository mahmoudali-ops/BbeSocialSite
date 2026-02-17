import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandiamgesService {

  private readonly httpClient=inject(HttpClient);

  getBrandsImageData():Observable<any>{
    return this.httpClient.get(`${environment.BaseUrl}/api/BrandImages`);
  }

  AddImages(data:FormData):Observable<any>{
    return this.httpClient.post(`${environment.BaseUrl}/api/BrandImages`,data);
  }


  deleteImage(id:number):Observable<any>{
    return this.httpClient.delete(`${environment.BaseUrl}/api/BrandImages/delete/${id}`);
  }

}
