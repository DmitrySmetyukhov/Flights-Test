import {FlightsService} from './flights.service';
import {CityEnum, Flight, } from '../data';
import * as moment from 'moment';
import {TestBed} from '@angular/core/testing';
import {mockFlights} from '../mockDataForTests';

describe('ApiService', () => {
  let flightsService: FlightsService;
  let flightsList: Flight[]; // testing data

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightsService]
    });

    flightsService = TestBed.get(FlightsService);

    flightsList = [...mockFlights].map(item => {
      return {...item};
    });
  });

  it('Should get correct data by price range', () => {
    const result = flightsService.getFilteredFlights({
      origin: CityEnum.Berlin,
      destination: CityEnum.Paris,
      startDate: moment().toISOString(),
      endDate: moment().add(10, 'days').toISOString(),
      priceFrom: 10,
      priceTo: 100,
      direct: true,
      connections: 0
    }, flightsList);

    expect(result.length).toBe(3, 'Incorrect number of flights by price range');
  });

  it('Should get correct data by date range', () => {
    const result = flightsService.getFilteredFlights({
      origin: CityEnum.Berlin,
      destination: CityEnum.Paris,
      startDate: moment().toISOString(),
      endDate: moment().add(6, 'hours').toISOString(),
      priceFrom: 10,
      priceTo: 200,
      direct: false,
      connections: 100
    }, flightsList);

    expect(result.length).toBe(2, 'Incorrect number of flights by date range');
  });

  it('Should get correct data by directions', done => {
    flightsService.getFlightsByFilter({
      origin: CityEnum.Berlin,
      destination: CityEnum.Paris,
      startDate: moment().toISOString(),
      endDate: moment().add(10, 'days').toISOString(),
      priceFrom: null,
      priceTo: null,
      direct: false,
      connections: 1
    }).subscribe(result => {
      expect(result.length).toBe(4, 'Incorrect number of flights by directions');
      done();
    });
  });

  it('Should get correct number of direct flights', done => {
    flightsService.getFlightsByFilter({
      origin: CityEnum.Berlin,
      destination: CityEnum.Paris,
      startDate: moment().toISOString(),
      endDate: moment().add(10, 'days').toISOString(),
      priceFrom: null,
      priceTo: null,
      direct: true,
      connections: 0
    }).subscribe(result => {
      expect(result.length).toBe(3, 'Incorrect number of direct flights');
      done();
    });
  });
});
