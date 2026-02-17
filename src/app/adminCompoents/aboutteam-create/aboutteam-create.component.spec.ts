import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutteamCreateComponent } from './aboutteam-create.component';

describe('AboutteamCreateComponent', () => {
  let component: AboutteamCreateComponent;
  let fixture: ComponentFixture<AboutteamCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutteamCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutteamCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
