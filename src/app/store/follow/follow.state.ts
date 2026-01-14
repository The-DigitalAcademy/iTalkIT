

// store/follow/follow.state.ts
import { User } from '../../models/user.model';
export interface FollowState {
  users: any;
  followers: any[];
  following: any[];
  isLoading: boolean;
  error: string | null;
}

export const initialFollowState: FollowState = {
  followers: [],
  following: [],
  isLoading: false,
  error: null,
  users: undefined
};