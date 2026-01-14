import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models';

export const loadUsers = createAction(
  '[Follow] Load Users',
  props<{ users: User[] }>()
);

export const followUser = createAction(
  '[Follow] Follow User',
  props<{ userId: string }>()
);

export const unfollowUser = createAction(
  '[Follow] Unfollow User',
  props<{ userId: string }>()
);

export const followFailed = createAction(
  '[Follow] Follow Failed',
  props<{ userId: string; previousState: boolean }>()
);
