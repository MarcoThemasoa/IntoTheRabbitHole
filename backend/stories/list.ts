import { api } from "encore.dev/api";
import { getSupabase } from "./supabase";
import type { ListStoriesResponse, Story } from "./types";

// Retrieves all approved stories, ordered by creation date.
export const list = api<void, ListStoriesResponse>(
  { expose: true, method: "GET", path: "/stories" },
  async () => {
    const supabase = getSupabase();
    const stories = await supabase.query<Story>("stories", {
      select: "*",
      eq: { status: "approved" },
      order: { column: "created_at", ascending: false },
    });

    return { stories };
  }
);
