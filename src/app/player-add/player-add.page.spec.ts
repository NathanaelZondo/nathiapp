import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerAddPage } from './player-add.page';

describe('PlayerAddPage', () => {
  let component: PlayerAddPage;
  let fixture: ComponentFixture<PlayerAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
