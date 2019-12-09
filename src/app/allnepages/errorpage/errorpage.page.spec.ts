import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ErrorpagePage } from './errorpage.page';

describe('ErrorpagePage', () => {
  let component: ErrorpagePage;
  let fixture: ComponentFixture<ErrorpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
