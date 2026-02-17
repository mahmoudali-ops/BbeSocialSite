import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecoreCraeteComponent } from './servicecore-craete.component';

describe('ServicecoreCraeteComponent', () => {
  let component: ServicecoreCraeteComponent;
  let fixture: ComponentFixture<ServicecoreCraeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicecoreCraeteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicecoreCraeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
