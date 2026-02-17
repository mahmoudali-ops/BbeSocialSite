import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicefeatureAdComponent } from './servicefeature-ad.component';

describe('ServicefeatureAdComponent', () => {
  let component: ServicefeatureAdComponent;
  let fixture: ComponentFixture<ServicefeatureAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicefeatureAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicefeatureAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
