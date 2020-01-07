import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTournamentPage } from './view-tournament.page';

describe('ViewTournamentPage', () => {
  let component: ViewTournamentPage;
  let fixture: ComponentFixture<ViewTournamentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTournamentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
