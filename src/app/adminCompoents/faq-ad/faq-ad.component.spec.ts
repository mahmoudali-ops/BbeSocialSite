import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqAdComponent } from './faq-ad.component';

describe('FaqAdComponent', () => {
  let component: FaqAdComponent;
  let fixture: ComponentFixture<FaqAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
