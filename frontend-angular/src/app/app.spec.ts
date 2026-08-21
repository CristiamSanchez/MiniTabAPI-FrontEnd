import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { TaskCategoryService } from './core/services/task-category.service';
import { TaskItemService } from './core/services/task-item.service';

describe('App', () => {
  const taskCategoryServiceMock = {
    getAll: () => of([]),
  };

  const taskItemServiceMock = {
    getAll: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: TaskCategoryService,
          useValue: taskCategoryServiceMock,
        },
        {
          provide: TaskItemService,
          useValue: taskItemServiceMock,
        },
      ],
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

  it('should identify a successful API connection', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.querySelector('.status-badge')
        ?.textContent,
    ).toContain('API connected');
  });

  it('should render the empty categories state', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.querySelector(
        '.category-placeholder',
      )?.textContent,
    ).toContain(
      'No categories have been created yet.',
    );
  });

  it('should render the empty tasks state', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.querySelector(
        '.tasks-panel .empty-state',
      )?.textContent,
    ).toContain('No tasks created yet');
  });
});
