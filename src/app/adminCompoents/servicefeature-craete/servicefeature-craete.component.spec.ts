import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicefeatureCraeteComponent } from './servicefeature-craete.component';

describe('ServicefeatureCraeteComponent', () => {
  let component: ServicefeatureCraeteComponent;
  let fixture: ComponentFixture<ServicefeatureCraeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicefeatureCraeteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicefeatureCraeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
