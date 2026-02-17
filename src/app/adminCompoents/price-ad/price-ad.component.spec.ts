import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAdComponent } from './price-ad.component';

describe('PriceAdComponent', () => {
  let component: PriceAdComponent;
  let fixture: ComponentFixture<PriceAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
