export interface ProfileState {
  currentProfile: any | null;
  isLoading: boolean;
  error: string | null;
}

export const initialProfileState: ProfileState = {
  currentProfile: null,
  isLoading: false,
  error: null
};