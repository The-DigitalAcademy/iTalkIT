import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'followedUsers';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private followedUsers$ = new BehaviorSubject<Set<number>>(this.load());

  private load(): Set<number> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set<number>(JSON.parse(raw)) : new Set();
  }

  private save(users: Set<number>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...users]));
  }

  isFollowing(userId: number): boolean {
    return this.followedUsers$.value.has(userId);
  }

  follow(userId: number): void {
    const updated = new Set(this.followedUsers$.value);
    updated.add(userId);
    this.save(updated);
    this.followedUsers$.next(updated);
  }

  unfollow(userId: number): void {
    const updated = new Set(this.followedUsers$.value);
    updated.delete(userId);
    this.save(updated);
    this.followedUsers$.next(updated);
  }
}
