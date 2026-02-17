import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandimageCreateComponent } from './brandimage-create.component';

describe('BrandimageCreateComponent', () => {
  let component: BrandimageCreateComponent;
  let fixture: ComponentFixture<BrandimageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandimageCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandimageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
