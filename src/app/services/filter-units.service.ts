import { Injectable } from '@angular/core';
import { Location } from '../types/location.interface';

// Horários fixos para diferentes períodos do dia
const OPENING_HOURS = {
  morning: {
    first: '06', // Horário de abertura do período da manhã
    last: '12' // Horário de fechamento do período da manhã
  },
  afternoon: {
    first: '12', // Horário de abertura do período da tarde
    last: '18' // Horário de fechamento do período da tarde
  },
  night: {
    first: '18', // Horário de abertura do período da noite
    last: '23' // Horário de fechamento do período da noite
  }
};

// Tipos de períodos válidos
type HOUR_INDEXES = 'morning' | 'afternoon' | 'night';

@Injectable({
  providedIn: 'root' // Torna este serviço acessível em todo o aplicativo
})
export class FilterUnitsService {

  constructor() { }

  filterUnits(unit: Location, open_hour: string, close_hour: string): boolean {
    // Se a unidade não possui horários, considerá-la válida
    if (!unit.schedules) return true;

    let open_hour_filter = parseInt(open_hour, 10);
    let close_hour_filter = parseInt(close_hour, 10);

    // Vai pega o dia da semana passado pelo sistema,
    // e transforma em uma string de acordo com o switch case da função
    let todays_weekday = this.transformWeekDay(new Date().getDay());

    // Percorre os horários de funcionamento da unidade
    for (let i = 0; i < unit.schedules.length; i++) {
      let schedule_hour = unit.schedules[i].hour;
      let schedule_weekday = unit.schedules[i].weekdays;

      // Verifica se o dia da semana corresponde ao dia atual
      if (todays_weekday === schedule_weekday) {
        if (schedule_hour !== 'Fechada') {
          // Divide os horários de abertura e fechamento da unidade
          let [unit_open_hour, unit_close_hour] = schedule_hour.split(' às ');
          // Remove o sufixo "h" e converte para número
          let unit_open_hour_int = parseInt(unit_open_hour.replace('h', ''), 10);
          let unit_close_hour_int = parseInt(unit_close_hour.replace('h', ''), 10);

          if (unit_open_hour_int <= open_hour_filter && unit_close_hour_int >= close_hour_filter) {
            return true;
          } else {
            return false;
          }
        }
      }
    }

    return false;
  }

  /**
   * Transforma um número de dia da semana em uma string legível.
   * @param weekday - Número do dia da semana (0 = domingo, 6 = sábado).
   * @returns Uma string representando o dia da semana.
   */
  transformWeekDay(weekday: number): string {
    switch (weekday) {
      case 0:
        return 'Dom.';
      case 6:
        return 'Sáb.';
      default:
        return 'Seg. à Sex.';
    }
  }

  filter(results: Location[], showClosed: boolean, hour: string): Location[] {
    let intermediateResults = results;

    // Filtra unidades abertas, se `showClosed` for falso
    if (!showClosed) {
      intermediateResults = results.filter(location => location.opened === true);
    }

    // Verifica se o `hour` é válido e aplica o filtro por horário
    if (hour && OPENING_HOURS[hour as HOUR_INDEXES]) {
      const OPEN_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].first; // Hora de abertura
      const CLOSE_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].last; // Hora de fechamento

      // Retorna os resultados que atendem ao filtro de horário
      return intermediateResults.filter(location =>
        this.filterUnits(location, OPEN_HOUR, CLOSE_HOUR)
      );
    } else {
      // Retorna todos os resultados intermediários se `hour` for inválido ou vazio
      return intermediateResults;
    }
  }
}
