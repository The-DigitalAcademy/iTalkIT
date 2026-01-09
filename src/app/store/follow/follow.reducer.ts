// store/follow/follow.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as FollowActions from './follow.actions';
import { initialFollowState } from './follow.state';

export const followReducer = createReducer(
  initialFollowState,

  on(FollowActions.loadUsers, (state, { users }) => ({
    ...state,
    users
  })),

  on(FollowActions.followUser, (state, { userId }) => ({
    ...state,
    users: state.users.map((u: { id: string; }) =>
      u.id === userId ? { ...u, isFollowing: true } : u
    )
  })),

  on(FollowActions.unfollowUser, (state, { userId }) => ({
    ...state,
    users: state.users.map((u: { id: string; }) =>
      u.id === userId ? { ...u, isFollowing: false } : u
    )
  })),

  on(FollowActions.followFailed, (state, { userId, previousState }) => ({
    ...state,
    users: state.users.map((u: { id: string; }) =>
      u.id === userId ? { ...u, isFollowing: previousState } : u
    )
  }))
);
