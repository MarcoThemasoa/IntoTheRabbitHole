import { api } from "encore.dev/api";
import { getSupabase } from "./supabase";

interface AnalyticsStats {
  totalVisitors: number;
  totalStories: number;
}

// Retrieves analytics statistics including total visitors and stories.
export const getStats = api<void, AnalyticsStats>(
  { expose: true, method: "GET", path: "/analytics/stats" },
  async () => {
    const supabase = getSupabase();
    const visitors = await supabase.rpc<number>("count_page_views", {});
    const stories = await supabase.rpc<number>("count_stories", {});

    return {
      totalVisitors: visitors || 0,
      totalStories: stories || 0,
    };
  }
);
