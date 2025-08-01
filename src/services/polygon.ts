import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable(
{
    providedIn: 'root'
})
// following class allows usage of Polygon API for usage in dashboard
export class Polygon 
{
    private url = "https://api.polygon.io/fed/v1/treasury-yields";
    private key = "KQ3fHkmJkdFOZYAp6VSSADMQipaanRbc";
        
    constructor(private http: HttpClient) { }

    getData(): Observable<any>
    {
        const params = new HttpParams()
            .set('apiKey', this.key)
            .set('limit', 365)
            .set('sort', 'date.desc');
        return this.http.get(this.url, {params});
    }
}
