import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecoreAdComponent } from './servicecore-ad.component';

describe('ServicecoreAdComponent', () => {
  let component: ServicecoreAdComponent;
  let fixture: ComponentFixture<ServicecoreAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicecoreAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicecoreAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
