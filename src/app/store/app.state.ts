import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from './auth/auth.state';
import { authReducer } from './auth/auth.reducer';

// Create minimal interfaces for now
export interface FeedState {
  // Will implement later
}

export interface FollowState {
  // Will implement later
}

export interface PostsState {
  // Will implement later
}

export interface ProfileState {
  // Will implement later
}

export interface AppState {
  auth: AuthState;
  feed: FeedState;
  follow: FollowState;
  posts: PostsState;
  profile: ProfileState;
}

// Create initial states
const initialFeedState: FeedState = {};
const initialFollowState: FollowState = {};
const initialPostsState: PostsState = {};
const initialProfileState: ProfileState = {};

// Create placeholder reducers
const feedReducer = (state = initialFeedState, action: any) => state;
const followReducer = (state = initialFollowState, action: any) => state;
const postsReducer = (state = initialPostsState, action: any) => state;
const profileReducer = (state = initialProfileState, action: any) => state;

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  feed: feedReducer,
  follow: followReducer,
  posts: postsReducer,
  profile: profileReducer,
};