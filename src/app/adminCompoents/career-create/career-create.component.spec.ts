import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerCreateComponent } from './career-create.component';

describe('CareerCreateComponent', () => {
  let component: CareerCreateComponent;
  let fixture: ComponentFixture<CareerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CareerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
