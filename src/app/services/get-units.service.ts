import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitsResponse } from '../types/units-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GetUnitsService {
  readonly apiUrl = "https://test-frontend-developer.s3.amazonaws.com/data/locations.json"

  //Para utilizar o HttpClient adicione provideHttpClient() em providers no app.config.ts
  constructor(private http: HttpClient) { }

  // O que está dentro <> é o tipo que será retornado
  // Nesse caso estamos criando um type de alguma coisa
  getAllUnits(): Observable<UnitsResponse> {
    return this.http.get<UnitsResponse>(this.apiUrl)
  }
}
