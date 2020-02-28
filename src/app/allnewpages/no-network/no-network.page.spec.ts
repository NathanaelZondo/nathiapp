import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoNetworkPage } from './no-network.page';

describe('NoNetworkPage', () => {
  let component: NoNetworkPage;
  let fixture: ComponentFixture<NoNetworkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoNetworkPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoNetworkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
