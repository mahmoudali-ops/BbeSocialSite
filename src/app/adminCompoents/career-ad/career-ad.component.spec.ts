import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerAdComponent } from './career-ad.component';

describe('CareerAdComponent', () => {
  let component: CareerAdComponent;
  let fixture: ComponentFixture<CareerAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CareerAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
