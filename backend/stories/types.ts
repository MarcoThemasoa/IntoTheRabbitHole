export interface Story {
  id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  author_name?: string;
  user_id?: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

export interface CreateStoryRequest {
  title: string;
  content: string;
  is_anonymous: boolean;
  author_name?: string;
  user_id?: string;
}

export interface CreateStoryResponse {
  story: Story;
}

export interface ListStoriesResponse {
  stories: Story[];
}
