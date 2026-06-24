import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getProfile, updateProfile, getProfileByUsername } from '../controllers/profileController.js';
import { submitScore, getLeaderboard, getUserScores } from '../controllers/scoreController.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/signup', async (req, res) => {
  const { email, password, username, fullName } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: "Format email tidak valid" });
  }

  if (username && !/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res.status(400).json({ success: false, message: "Username hanya boleh mengandung huruf, angka, garis bawah, dan tanda hubung" });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if user already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', cleanEmail)
    .single();

  if (existingProfile) {
    return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
  }

  const clientId = "cli_" + Math.random().toString(36).substr(2, 9);
  const clientProfile = {
    id: clientId,
    username: username || cleanEmail.split('@')[0].toLowerCase(),
    full_name: fullName || cleanEmail.split('@')[0],
    email: cleanEmail,
    level: 1,
    xp: 0,
    avatar: "🎮",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  await supabase.from('profiles').insert(clientProfile);

  const token = `simulated_jwt_token_${clientProfile.id}`;

  res.status(201).json({
    success: true,
    token,
    session: {
      access_token: token,
      refresh_token: 'mock-refresh-token',
      user: {
        id: clientProfile.id,
        email: clientProfile.email
      }
    },
    client: {
      clientId: clientProfile.id,
      username: clientProfile.username,
      email: clientProfile.email,
      created_at: clientProfile.created_at
    }
  });
});

router.post('/auth/login', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: "Format email tidak valid" });
  }

  const cleanEmail = email.trim().toLowerCase();
  
  // Find or Create user profile
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', cleanEmail)
    .single();

  let clientProfile = existingProfile;

  if (!clientProfile) {
    const clientId = "cli_" + Math.random().toString(36).substr(2, 9);
    clientProfile = {
      id: clientId,
      username: cleanEmail.split('@')[0].toLowerCase(),
      full_name: cleanEmail.split('@')[0],
      email: cleanEmail,
      level: 1,
      xp: 0,
      avatar: "🎮",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await supabase.from('profiles').insert(clientProfile);
  }

  // Create a simulated JWT token using user id
  const token = `simulated_jwt_token_${clientProfile.id}`;

  res.json({
    success: true,
    token,
    session: {
      access_token: token,
      refresh_token: 'mock-refresh-token',
      user: {
        id: clientProfile.id,
        email: clientProfile.email
      }
    },
    client: {
      clientId: clientProfile.id,
      username: clientProfile.username,
      email: clientProfile.email,
      created_at: clientProfile.created_at || clientProfile.updated_at
    }
  });
});

// --- Profile Routes (Protected) ---
router.get('/profiles/me', protectRoute, getProfile);
router.get('/profiles/user/:username', protectRoute, getProfileByUsername);
router.put('/profiles/me', protectRoute, updateProfile);

// --- Score Routes ---
router.post('/scores', protectRoute, submitScore);
router.get('/scores/me', protectRoute, getUserScores);
router.get('/scores/leaderboard/:game_type', getLeaderboard);

export default router;

