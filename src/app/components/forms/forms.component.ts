import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  //Lembrar de importar o ReactiveFormsModule que não entra automaticamente
  imports: [ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {
  results = [];
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private unitService: GetUnitsService
  ) {}

  ngOnInit(): void {
    this.unitService.getAllUnits().subscribe(data => console.log(data))
    //Dentro será declarado os campos do formulário
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: false
    })
  }

  onSubmit() {
    console.log(this.formGroup.value)
  }

  onClean() {
    this.formGroup.reset()
  }

}
