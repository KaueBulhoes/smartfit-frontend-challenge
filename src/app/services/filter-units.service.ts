import { Injectable } from '@angular/core';
import { Location } from '../types/location.interface';

const OPENING_HOURS = {
  morning: {
    first: '06',
    last: '12'
  },
  afternoon: {
    first: '12',
    last: '18'
  },
  night: {
    first: '18',
    last: '23'
  }
}

type HOUR_INDEXES = 'morning' | 'afternoon' | 'night'

@Injectable({
  providedIn: 'root'
})
export class FilterUnitsService {

  constructor() { }

  filterUnits(unit: Location, open_hour: string, close_hour: string) {
    if (!unit.schedules) return true;

    let open_hour_filter = parseInt(open_hour, 10)
    let close_hour_filter = parseInt(close_hour, 10)

    // Pega o dia da semana sendo domingo 0 e sábado 6
    let todays_weekday = this.transformWeekDay(new Date().getDay())

    for (let i = 0; i < unit.schedules.length; i++) {
      let schedule_hour = unit.schedules[i].hour
      let schedule_weekday = unit.schedules[i].weekdays

      if (todays_weekday === schedule_weekday) {
        if (schedule_hour !== 'Fechada') {
          // Primeiro vai serparar as variáveis pelo ás
          let [unit_open_hour, unit_close_hour] = schedule_hour.split(' às ')
          // Depois vai retirar o h, assim pode virar um int
          let unit_open_hour_int = parseInt(unit_open_hour.replace('h', ''), 10)
          let unit_close_hour_int = parseInt(unit_close_hour.replace('h', ''), 10)

          if (unit_open_hour_int <= open_hour_filter && unit_close_hour_int >= close_hour_filter) return true
          else return false
        }
      }
    }

    return false;
  }
  // Feito para poder transformar em number os dias da semana que vem da API
  transformWeekDay(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.'
      case 6:
        return 'Sáb.'
      default:
        return 'Seg. à Sex.'
    }
  }

  filter(results: Location[], showClosed: boolean, hour: string) {
    let intermediateResults = results;

    // Filtrar unidades abertas, se necessário
    if (!showClosed) {
      intermediateResults = results.filter(location => location.opened === true);
    }

    // Verificar se o valor de "hour" é válido e também garantir que o OPENING_HOURS exista
    if (hour && OPENING_HOURS[hour as HOUR_INDEXES]) {
      const OPEN_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].first;
      const CLOSE_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].last;

      return intermediateResults.filter(location =>
        this.filterUnits(location, OPEN_HOUR, CLOSE_HOUR)
      );
    } else {
      // Se "hour" estiver vazio, use todos os resultados intermediários
      return intermediateResults;
    }
  }
}
