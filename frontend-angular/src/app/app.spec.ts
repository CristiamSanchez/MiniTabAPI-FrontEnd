import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render the MiniTask heading', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.querySelector('h1')?.textContent,
    ).toContain(
      'Turn your plans into completed work.',
    );
  });

  it('should identify Angular as the frontend', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.querySelector('.status-badge')
        ?.textContent,
    ).toContain('Angular ready');
  });
});