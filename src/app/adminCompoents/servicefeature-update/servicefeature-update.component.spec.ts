import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicefeatureUpdateComponent } from './servicefeature-update.component';

describe('ServicefeatureUpdateComponent', () => {
  let component: ServicefeatureUpdateComponent;
  let fixture: ComponentFixture<ServicefeatureUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicefeatureUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicefeatureUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
