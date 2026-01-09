// store/follow/follow.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FollowState } from './follow.state';

export const selectFollowState =
  createFeatureSelector<FollowState>('follow');

export const selectUsers = createSelector(
  selectFollowState,
  state => state.users
);

export const selectFollowedUserIds = createSelector(
  selectUsers,
  users => users.filter((u: { isFollowing: any; }) => u.isFollowing).map((u: { id: any; }) => u.id)
);
