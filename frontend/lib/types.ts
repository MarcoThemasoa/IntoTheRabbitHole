// Lokasi: frontend/lib/types.ts

// Tipe ini dari backend/stories/types.ts
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

// Tipe ini dari backend/stories/list.ts
export interface ListStoriesResponse {
  stories: Story[];
}

// Tipe ini dari backend/analytics/stats.ts
export interface AnalyticsStats {
  totalVisitors: number;
  totalStories: number;
}