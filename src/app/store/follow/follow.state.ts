export interface FollowState {
  followers: any[];
  following: any[];
  isLoading: boolean;
  error: string | null;
}

export const initialFollowState: FollowState = {
  followers: [],
  following: [],
  isLoading: false,
  error: null
};