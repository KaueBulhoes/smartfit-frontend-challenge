import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { Location } from '../../types/location.interface';

@Component({
  selector: 'app-forms',
  standalone: true,
  //Lembrar de importar o ReactiveFormsModule que não entra automaticamente
  imports: [ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {
  results: Location[] = [];
  filtredResults: Location [] = [];
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private unitService: GetUnitsService
  ) {}

  ngOnInit(): void {
    //Dentro será declarado os campos do formulário
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true
    })
    //Chamando o service
    this.unitService.getAllUnits().subscribe(data => {
      this.results = data.locations;
      this.filtredResults = data.locations;
    })
  }

  onSubmit() {
    //Se o valor do formGroupd NÃO for showClosed
    if(!this.formGroup.value.showClosed) {
      this.filtredResults = this.results.filter(location => location.opened === true)
    } else {
      this.filtredResults = this.results
    }
  }

  onClean() {
    this.formGroup.reset()
  }

}
