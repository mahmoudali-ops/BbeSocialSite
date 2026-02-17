import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutteamUpdateComponent } from '../aboutteam-update/aboutteam-update.component';


describe('AboutUpdateComponent', () => {
  let component: AboutteamUpdateComponent;
  let fixture: ComponentFixture<AboutteamUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutteamUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutteamUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
