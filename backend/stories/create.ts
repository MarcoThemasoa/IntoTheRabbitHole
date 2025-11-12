// 1. Import your CUSTOM client, not the standard one
import { getSupabase } from './supabase.js';

export async function createStory(req: { title: any; content: any; is_anonymous: any; author_name: any; user_id: any; }) {
  const { title, content, is_anonymous, author_name, user_id } = req;
  
  // 2. Get your custom client instance
  const supabase = getSupabase();

  // 3. Prepare the data object
  const storyData = {
    title,
    content,
    is_anonymous,
    author_name: is_anonymous ? null : author_name,
    user_id: user_id || null,
    status: 'approved', // This will override the 'pending' default, which is fine
    // We don't need 'created_at', the database will add it automatically
  };

  // 4. Use your custom .insert() method
  try {
    const newStory = await supabase.insert("stories", storyData);
    
    // 5. Your custom method returns the new story object directly
    return { story: newStory };
  } catch (error) {
    console.error("Error in createStory function:", error);
    throw error; // This will be caught by your server.ts error handler
  }
}