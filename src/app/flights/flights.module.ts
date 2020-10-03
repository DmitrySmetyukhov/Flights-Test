import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlightsSearchComponent} from './flights-search/flights-search.component';
import {Route, RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FlightsService} from './sevices/flights.service';

const routes: Route[] = [
  {
    path: 'flights',
    component: FlightsSearchComponent
  },
  {
    path: '**',
    redirectTo: 'flights',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [FlightsSearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule
  ],
  providers: [
    FlightsService,
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})
export class FlightsModule {
}
