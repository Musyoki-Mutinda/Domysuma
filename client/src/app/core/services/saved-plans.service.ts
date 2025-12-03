import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SavedPlansService {

  constructor(private authService: AuthService) {}

  /** Save plan by ID (existing method) */
  savePlan(planId: number) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.warn('Cannot save plan: user not logged in.');
      return;
    }

    const key = `saved_plans_${userId}`;
    const existing: number[] = JSON.parse(localStorage.getItem(key) || '[]');

    if (!existing.includes(planId)) {
      existing.push(planId);
    }

    localStorage.setItem(key, JSON.stringify(existing));
  }

  /** Add a full plan object to saved plans (new method) */
  addPlan(plan: any) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.warn('Cannot add plan: user not logged in.');
      return;
    }

    const key = `saved_plans_objects_${userId}`;
    const existing: any[] = JSON.parse(localStorage.getItem(key) || '[]');

    if (!existing.find(p => p.id === plan.id)) {
      existing.push(plan);
    }

    localStorage.setItem(key, JSON.stringify(existing));
  }

  /** Remove a saved plan by ID */
  removePlan(planId: number) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const key = `saved_plans_objects_${userId}`;
    const existing: any[] = JSON.parse(localStorage.getItem(key) || '[]');

    const updated = existing.filter(p => p.id !== planId);
    localStorage.setItem(key, JSON.stringify(updated));
  }

  /** Get saved plan objects */
  getPlans(): any[] {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return [];

    const key = `saved_plans_objects_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  /** Get saved plan IDs */
  getSavedPlans(): number[] {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return [];

    const key = `saved_plans_${userId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  /** Check if a plan is saved */
  isPlanSaved(planId: number): boolean {
    return this.getSavedPlans().includes(planId);
  }

  /** Clear all saved plans for the user */
  clearAll() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    localStorage.removeItem(`saved_plans_${userId}`);
    localStorage.removeItem(`saved_plans_objects_${userId}`);
  }
}
