import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const navbarTitle = fixture.debugElement.query(By.css('.navbar-title')).nativeElement;
    expect(navbarTitle.textContent).toContain('My Secure App'); // Titlul exact trebuie să fie adaptat
  });

  it('should contain navigation links', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
    expect(navLinks.length).toBeGreaterThan(0); // Navbar-ul trebuie să conțină cel puțin un link
  });
});
