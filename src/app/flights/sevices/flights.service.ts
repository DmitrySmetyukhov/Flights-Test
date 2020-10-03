import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {cities, Flight, flights, FlightsFilterRequestDto} from '../data';
import * as moment from 'moment';
import {delay} from 'rxjs/operators';

@Injectable()
export class FlightsService {

  public getCitiesList() {
    return of(cities).pipe(delay(1000));
  }

  public getFlightsByFilter(filter: FlightsFilterRequestDto): Observable<Flight[]> {
    // back-end imitation
    const filteredFlights: Flight[] = this.getFilteredFlights(filter, this.flightsList)
      .map(flight => {
        if (flight.parts) {
          // populate parts
          flight.parts = flight.parts.map(id => {
            return flights.find(item => item.id === id);
          });
        }

        return flight;
      });

    return of(filteredFlights).pipe(delay(1000));
  }

  public getFilteredFlights(filter: FlightsFilterRequestDto, list: Flight[]): Flight[] {
    const byDestination: Flight[] = list.filter(item => item.origin === filter.origin && item.destination === filter.destination);
    const byDate = byDestination.filter(item => {
      if (moment(filter.startDate).isSame(filter.endDate) || !moment(filter.endDate).isValid()) {
        return moment(item.date).isSameOrAfter(filter.startDate);
      }

      return moment(item.date).isSameOrAfter(filter.startDate) && moment(item.date).isSameOrBefore(filter.endDate);
    });

    const byPrice = byDate.filter(item => {
      if (filter.priceFrom && filter.priceTo) {
        return item.price >= filter.priceFrom && item.price <= filter.priceTo;
      }

      if (filter.priceFrom) {
        return item.price >= filter.priceFrom;
      }

      if (filter.priceTo) {
        return item.price <= filter.priceTo;
      }

      return item;
    });

    return byPrice.filter(item => !item.stations || item.stations <= filter.connections);
  }

  private get flightsList() {
    return [...flights].map(item => {
      return {...item};
    });
  }
}
