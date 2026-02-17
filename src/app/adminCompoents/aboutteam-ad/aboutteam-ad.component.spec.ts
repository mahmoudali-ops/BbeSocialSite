import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutteamAdComponent } from './aboutteam-ad.component';

describe('AboutteamAdComponent', () => {
  let component: AboutteamAdComponent;
  let fixture: ComponentFixture<AboutteamAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutteamAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutteamAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
