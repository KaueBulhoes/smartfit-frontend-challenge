import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { Location } from '../../types/location.interface';
import { FilterUnitsService } from '../../services/filter-units.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  // Lembre-se de importar o ReactiveFormsModule no módulo pai, pois ele não é incluído automaticamente.
  imports: [ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {
  // Lista de resultados obtidos do serviço
  results: Location[] = [];
  // Lista de resultados filtrados com base no formulário
  filtredResults: Location[] = [];
  // Grupo de formulários para lidar com os campos do formulário
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, // Para criar e gerenciar o grupo de formulários
    private unitService: GetUnitsService, // Serviço responsável por buscar todas as unidades
    private filterUnitsService: FilterUnitsService // Serviço responsável por filtrar as unidades
  ) { }

  ngOnInit(): void {
    // Inicializa o grupo de formulários com os campos necessários
    this.formGroup = this.formBuilder.group({
      hour: '', // Campo para horário
      showClosed: true // Campo para exibir ou ocultar unidades fechadas
    });

    // Chama o serviço para buscar todas as unidades
    this.unitService.getAllUnits().subscribe(data => {
      // Armazena os resultados completos na propriedade `results`
      this.results = data.locations;
      // Inicializa a lista filtrada com todos os resultados
      this.filtredResults = data.locations;
    });
  }

  // Método chamado ao submeter o formulário
  onSubmit() {
    // Extrai os valores dos campos do formulário
    let { showClosed, hour } = this.formGroup.value;
    // Filtra os resultados com base nos valores do formulário
    this.filtredResults = this.filterUnitsService.filter(this.results, showClosed, hour);
  }

  // Método para limpar o formulário e restaurar os valores iniciais
  onClean() {
    this.formGroup.reset(); // Reseta os valores do formulário
  }
}
