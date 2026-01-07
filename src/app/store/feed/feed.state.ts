export interface FeedState {
  posts: any[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

export const initialFeedState: FeedState = {
  posts: [],
  isLoading: false,
  error: null,
  page: 0,
  hasMore: true
};