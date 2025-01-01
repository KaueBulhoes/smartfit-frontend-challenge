import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnitsResponse } from '../types/units-response.interface';
import { Location } from '../types/location.interface';

@Injectable({
  providedIn: 'root'
})
export class GetUnitsService {
  readonly apiUrl = "https://test-frontend-developer.s3.amazonaws.com/data/locations.json"

  // BehaviorSubject é algo que muda seu comportamento
  private allUnitsSubject: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([])
  // Depois eu transformo o meu BehaviorSubject em um Observable que irá notificar quem o estiver observando
  private allUnits$: Observable<Location[]> = this.allUnitsSubject.asObservable();
  private filteredUnits: Location[] = []

  //Para utilizar o HttpClient adicione provideHttpClient() em providers no app.config.ts
  constructor(private http: HttpClient) {
    this.http.get<UnitsResponse>(this.apiUrl).subscribe(data => {
      // O allUnitsSubject terá seu valor mudado através do next, com o data.locations
      this.allUnitsSubject.next(data.locations);
      this.filteredUnits = data.locations
    });
  }

  // O que está dentro <> é o tipo que será retornado
  // Nesse caso estamos criando um type de alguma coisa
  getAllUnits(): Observable<Location[]> {
    return this.allUnits$
  }

  getFilteredUnits() {
    return this.filteredUnits;
  }

  setFilteredUnits(value: Location[]) {
    this.filteredUnits = value
  }
}
