import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqCraeteComponent } from './faq-craete.component';

describe('FaqCraeteComponent', () => {
  let component: FaqCraeteComponent;
  let fixture: ComponentFixture<FaqCraeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqCraeteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqCraeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
