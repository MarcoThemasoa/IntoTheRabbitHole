import { api } from "encore.dev/api";
import { getSupabase } from "./supabase";
import type { CreateStoryRequest, CreateStoryResponse, Story } from "./types";

// Creates a new victim story that can be anonymous or identified.
export const create = api<CreateStoryRequest, CreateStoryResponse>(
  { expose: true, method: "POST", path: "/stories" },
  async (req) => {
    const supabase = getSupabase();
    const story = await supabase.insert<Story>("stories", {
      title: req.title,
      content: req.content,
      is_anonymous: req.is_anonymous,
      author_name: req.is_anonymous ? null : req.author_name,
      user_id: req.user_id || null,
      status: "approved",
      created_at: new Date().toISOString(),
    });

    return { story };
  }
);
