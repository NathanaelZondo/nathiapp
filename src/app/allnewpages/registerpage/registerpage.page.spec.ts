import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterpagePage } from './registerpage.page';

describe('RegisterpagePage', () => {
  let component: RegisterpagePage;
  let fixture: ComponentFixture<RegisterpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
