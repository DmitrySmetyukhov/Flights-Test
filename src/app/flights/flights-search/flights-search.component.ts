import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {City, CityEnum, Flight, FlightsFilterRequestDto} from '../data';
import {FlightsService} from '../sevices/flights.service';
import {first, shareReplay} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-flights-search',
  templateUrl: './flights-search.component.html',
  styleUrls: ['./flights-search.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed, void => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FlightsSearchComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  public pending = false;
  public cities$: Observable<City[]>;
  public form: FormGroup;
  public displayedColumns: string[] = ['origin', 'destination', 'stations', 'length'];
  public sortingColumns = ['stations', 'length'];
  public dataSource = new MatTableDataSource([]);
  public expandedElement: number | null;
  public minDate = moment();
  public connectionsCount: number[] = [...Array(10).keys()].map(x => x + 1);

  constructor(
    private apiService: FlightsService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.buildForm();
    this.cities$ = this.apiService.getCitiesList().pipe(shareReplay());
    this.activeRoute.queryParams.pipe(first()).subscribe(queryParams => {
      this.form.patchValue(this.sanitizeQueryParams(queryParams));
      if (this.form.valid) {
        this.search();
      }
    });
  }

  public get origin() {
    return this.form.get('origin');
  }

  public get destination() {
    return this.form.get('destination');
  }

  public get direct() {
    return this.form.get('direct');
  }

  public get startDate() {
    return this.form.get('startDate');
  }

  public get endDate() {
    return this.form.get('endDate');
  }

  public get connections() {
    return this.form.get('connections');
  }

  public search() {
    this.pending = true;
    if (!this.endDate.value) {
      this.endDate.setValue(this.startDate.value);
    }
    this.updateQueryParams(this.form.value);

    this.apiService.getFlightsByFilter(
      this.form.value
    ).subscribe((flights: Flight[]) => {
      this.pending = false;
      this.dataSource.data = flights;
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      origin: [null, [Validators.required]],
      destination: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null],
      priceFrom: [],
      priceTo: [],
      direct: [true],
      connections: [null]
    });

    this.direct.valueChanges.subscribe(val => {
      if (val) {
        this.connections.setValue(null);
      }
    });
  }

  private updateQueryParams(params) {
    const settings = {
      queryParams: {
        ...params,
        startDate: moment(params.startDate).format('YYYY-MM-DD'),
        endDate: moment(params.endDate).format('YYYY-MM-DD')
      },
      relativeTo: this.activeRoute
    };

    this.router.navigate([], settings);
  }

  public sanitizeQueryParams = (params: any) => {
    const result = {} as FlightsFilterRequestDto;
    if (params.origin && CityEnum[params.origin]) {
      result.origin = params.origin;
    }

    if (params.destination && CityEnum[params.destination]) {
      result.destination = params.destination;
    }

    if (params.startDate && moment(params.startDate, 'YYYY-MM-DD').isValid()) {
      result.startDate = moment(params.startDate, 'YYYY-MM-DD');
    }

    if (params.endDate && moment(params.endDate, 'YYYY-MM-DD').isValid()) {
      result.endDate = moment(params.endDate, 'YYYY-MM-DD');
    }

    if (params.priceFrom && !isNaN(params.priceFrom)) {
      result.priceFrom = +params.priceFrom;
    }

    if (params.priceTo && !isNaN(params.priceTo)) {
      result.priceTo = +params.priceTo;
    }

    if (params.direct === 'true') {
      result.direct = true;
    } else if (params.direct === 'false') {
      result.direct = false;
    }

    if (params.connections && !isNaN(params.connections)) {
      result.connections = +params.connections;
    }

    return result;
  }

}
