import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ApplyTournamentPage } from './apply-tournament.page';

describe('ApplyTournamentPage', () => {
  let component: ApplyTournamentPage;
  let fixture: ComponentFixture<ApplyTournamentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyTournamentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyTournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
