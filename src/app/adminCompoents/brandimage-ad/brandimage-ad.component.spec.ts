import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandimageAdComponent } from './brandimage-ad.component';

describe('BrandimageAdComponent', () => {
  let component: BrandimageAdComponent;
  let fixture: ComponentFixture<BrandimageAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandimageAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandimageAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
