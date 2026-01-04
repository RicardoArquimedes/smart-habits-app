import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Habit } from '../../../../core/models/habit.model';
import { Observable } from 'rxjs';
import { HabitApiResponse } from '../../../../core/models/habit-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class HabitsApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'https://5yslchovr9.execute-api.us-east-2.amazonaws.com/dev/habits';

  // =========================
  // GET
  // =========================
  getHabits() {
    return this.http.get<HabitApiResponse[]>(`${this.baseUrl}`);
  }

  // =========================
  // POST (crear)
  // =========================
  createHabit(payload: { title: string; date: string }) {
    return this.http.post<HabitApiResponse>(`${this.baseUrl}`, payload);
  }

  // =========================
  // PUT (editar / toggle)
  // =========================
  // baseUrl = https://.../dev/habits

  deleteHabit(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateHabit(id: string, payload: { title?: string; completed?: boolean }) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }
}
