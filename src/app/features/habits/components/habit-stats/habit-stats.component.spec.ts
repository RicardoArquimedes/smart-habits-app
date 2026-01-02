import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitStatsComponent } from './habit-stats.component';

describe('HabitStatsComponent', () => {
  let component: HabitStatsComponent;
  let fixture: ComponentFixture<HabitStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
