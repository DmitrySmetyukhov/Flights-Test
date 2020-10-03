import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlightsSearchComponent} from './flights-search.component';
import {FlightsModule} from '../flights.module';
import {RouterTestingModule} from '@angular/router/testing';
import { CityEnum, Flight} from '../data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FlightsService} from '../sevices/flights.service';
import {of} from 'rxjs';
import {mockCities, mockFlights} from '../mockDataForTests';

describe('FlightsSearchComponent', () => {
  let component: FlightsSearchComponent;
  let fixture: ComponentFixture<FlightsSearchComponent>;
  let el: DebugElement;
  let flightsService: any;
  let flightsList: Flight[]; // testing data

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getFlightsByFilter', 'getCitiesList']);
    flightsList = [...mockFlights].map(item => {
      return {...item};
    });
    TestBed.configureTestingModule({
      imports: [FlightsModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        {provide: FlightsService, useValue: apiServiceSpy}
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(FlightsSearchComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      flightsService = TestBed.get(FlightsService);
      flightsService.getCitiesList.and.returnValue(of(mockCities));
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should display flights list', () => {
    component.dataSource.data = flightsList;
    fixture.detectChanges();

    const items = el.queryAll(By.css('.element-detail'));
    expect(items).toBeTruthy('Could not find flights');
    expect(items.length).toBe(6, 'Unexpected number of flights');
  });

  it('Should sanitize query params', () => {
    let result = component.sanitizeQueryParams({
      origin: 'Paris',
      destination: 'Berlin',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      priceFrom: '100',
      priceTo: '200',
      direct: 'false',
      connections: '2'
    });

    expect(result.origin).toBe(CityEnum.Paris, 'Incorrect city recognizing (origin)');
    expect(result.destination).toBe(CityEnum.Berlin, 'Incorrect city recognizing (destination)');
    expect(result.startDate).toBeTruthy('Incorrect date parsing');
    expect(result.endDate).toBeTruthy('Incorrect date parsing');
    expect(result.priceFrom).toBe(100, 'Incorrect price parsing');
    expect(result.priceTo).toBe(200, 'Incorrect price parsing');
    expect(result.direct).toBe(false, 'Incorrect boolean parsing');
    expect(result.connections).toBe(2, 'Incorrect connections parsing');

    result = component.sanitizeQueryParams({
      origin: 'test',
      destination: 'test',
      startDate: 'test',
      endDate: 'test',
      priceFrom: 'test',
      priceTo: 'test',
      direct: 'test',
      connections: 'test'
    });

    expect(result.origin).toBeUndefined('Incorrect city filtering (origin)');
    expect(result.destination).toBeUndefined('Incorrect city filtering (destination)');
    expect(result.startDate).toBeUndefined('Incorrect date filtering (startDate)');
    expect(result.endDate).toBeUndefined('Incorrect date filtering (endDate)');
    expect(result.priceFrom).toBeUndefined('Incorrect price filtering (priceFrom)');
    expect(result.priceTo).toBeUndefined('Incorrect price filtering (priceTo)');
    expect(result.direct).toBeUndefined('Incorrect boolean filtering');
    expect(result.connections).toBeUndefined('Incorrect connections filtering');
  });
});
