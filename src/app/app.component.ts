import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { FormsComponent } from "./components/forms/forms.component";
import { BehaviorSubject } from 'rxjs';
import { CardsListComponent } from "./components/cards-list/cards-list.component";
import { CommonModule } from '@angular/common';
import { Location } from './types/location.interface';
import { GetUnitsService } from './services/get-units.service';
import { LegendsComponent } from "./components/legends/legends.component";

// Devido ao uso de forma assíncrona no HTML, devemos importar o CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FormsComponent, CardsListComponent, CommonModule, LegendsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showList = new BehaviorSubject(false)
  unitsList: Location[] = []

  constructor(private unitService: GetUnitsService) {}

  onSubmit() {
    this.showList.next(true)
    this.unitsList = this.unitService.getFilteredUnits();
  }
}
