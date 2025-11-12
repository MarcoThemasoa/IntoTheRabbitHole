import express from 'express';
import bodyParser from 'body-parser';
import { createStory } from './stories/create.js';
import cors from 'cors';
import { getSupabase } from './stories/supabase.js'; // <-- FIX 1: Import from './supabase.js'

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


const app = express();
app.set('trust proxy', true);
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Your existing POST route
app.post('/stories', async (req, res) => {
  try {
    const result = await createStory(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/analytics/track', async (req, res) => {
  try {
    const supabase = getSupabase();

    // Get the user's IP address from the request object
    const userIp = req.ip; 
    console.log('Attempting to track page view for IP:', userIp);

    await supabase.rpc("track_page_view", { user_ip: userIp });

    res.status(200).json({ success: true });
  } catch (err: any) {
    // --- ALSO ADD THIS LINE ---
    console.error('Error tracking page view:', err.message); 
    res.status(500).json({ error: err.message });
  }
});

// --- FIX 2: Corrected GET route ---
app.get('/stories', async (req, res) => {
  try {
    const supabase = getSupabase(); // This now works

    // Use your custom .query() method, not .from().select()
    const stories = await supabase.query("stories", {
      select: "*",
      eq: { status: "approved" },
      order: { column: "created_at", ascending: false }
    });

    // Send the stories back to the frontend
    res.json({ stories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/analytics/stats', async (req, res) => {
  try {
    const supabase = getSupabase();

    // Call the two RPC functions
    const visitors = await supabase.rpc<number>("count_page_views", {});
    const stories = await supabase.rpc<number>("count_stories", {});

    // Send the stats back as JSON
    res.json({
      totalVisitors: visitors || 0,
      totalStories: stories || 0,
    });
    
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
// --- END OF FIX ---

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});