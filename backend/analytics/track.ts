import { api } from "encore.dev/api";
import { getSupabase } from "./supabase";

interface TrackPageViewRequest {
  page: string;
  referrer?: string;
}

// Records a page view in the analytics database.
export const trackPageView = api<TrackPageViewRequest, void>(
  { expose: true, method: "POST", path: "/analytics/track" },
  async (req) => {
    const supabase = getSupabase();
    await supabase.insert("page_views", {
      page: req.page,
      referrer: req.referrer,
      visited_at: new Date().toISOString(),
    });
  }
);
