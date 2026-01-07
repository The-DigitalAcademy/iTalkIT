// src/app/store/posts/posts.state.ts
export interface PostsState {
  userPosts: any[];
  currentPost: any | null;
  isLoading: boolean;
  error: string | null;
}

export const initialPostsState: PostsState = {
  userPosts: [],
  currentPost: null,
  isLoading: false,
  error: null
};