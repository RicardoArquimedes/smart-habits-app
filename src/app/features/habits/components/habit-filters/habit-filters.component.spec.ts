import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitFiltersComponent } from './habit-filters.component';

describe('HabitFiltersComponent', () => {
  let component: HabitFiltersComponent;
  let fixture: ComponentFixture<HabitFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
