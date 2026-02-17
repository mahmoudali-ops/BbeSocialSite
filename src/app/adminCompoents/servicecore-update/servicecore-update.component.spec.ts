import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecoreUpdateComponent } from './servicecore-update.component';

describe('ServicecoreUpdateComponent', () => {
  let component: ServicecoreUpdateComponent;
  let fixture: ComponentFixture<ServicecoreUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicecoreUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicecoreUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
