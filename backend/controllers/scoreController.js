import { supabase } from '../config/supabase.js';

const calculateLevel = (xp) => {
  if (xp >= 50000) return 50;
  if (xp >= 8000) return 20;
  if (xp >= 2000) return 10;
  if (xp >= 500) return 5;
  return 1;
};

import { z } from 'zod';

const scoreSchema = z.object({
  game_type: z.string().min(1),
  score_value: z.number().min(0).max(1000000)
});

export const submitScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const parsed = scoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Validasi skor gagal: game_type harus string dan score_value harus angka positif <= 1000000" });
    }
    const { game_type, score_value } = parsed.data;
    const { additional_data } = req.body;

    // Save the score
    const newScore = {
      id: "score_" + Math.random().toString(36).substr(2, 9),
      user_id: userId,
      game_type,
      score_value,
      additional_data: additional_data || {},
      created_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase.from('scores').insert(newScore);
    
    if (insertError) {
      return res.status(500).json({ success: false, message: "Gagal menyimpan skor" });
    }

    // Process XP and leveling
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    
    let xpGained = 50; // default base XP per game
    let isNewPersonalBest = false;
    let levelUp = false;

    // Optional: check personal best logic using old scores
    const { data: previousScores } = await supabase.from('scores').select('score_value').eq('user_id', userId).eq('game_type', game_type);
    
    // For reaction time & aim trainer, lower is better. For others, higher is better.
    let isBetter = false;
    if (previousScores && previousScores.length > 1) {
      const pastBest = previousScores
        .filter(s => s.id !== newScore.id)
        .map(s => s.score_value)
        .reduce((a, b) => {
          if (game_type === 'reaction_time') return Math.min(a, b);
          return Math.max(a, b);
        }, game_type === 'reaction_time' ? Infinity : -Infinity);
      
      if (game_type === 'reaction_time') {
        isBetter = score_value < pastBest;
      } else {
        isBetter = score_value > pastBest;
      }
    } else {
      isBetter = true; // First time playing
    }
    
    isNewPersonalBest = isBetter;
    if (isNewPersonalBest) xpGained += 50; // Bonus for personal best

    if (profile) {
      const newXp = (profile.xp || 0) + xpGained;
      const oldLevel = profile.level || 1;
      const newLevel = calculateLevel(newXp);
      
      levelUp = newLevel > oldLevel;

      const updatedProfile = {
        ...profile,
        xp: newXp,
        level: newLevel,
        updated_at: new Date().toISOString()
      };

      await supabase.from('profiles').update(updatedProfile).eq('id', userId);

      return res.json({
        success: true,
        xpGained,
        isNewPersonalBest,
        levelUp,
        profile: updatedProfile
      });
    }

    res.json({
      success: true,
      xpGained,
      isNewPersonalBest,
      levelUp
    });
  } catch (err) {
    console.error("Controller SubmitScore Error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan internal" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { game_type } = req.params;
    
    // For Reaction Time, lower score is better (ascending = true)
    const isAscending = game_type === 'reaction_time';

    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('game_type', game_type)
      .order('score_value', { ascending: isAscending })
      .limit(10); // top 10

    if (error) {
      return res.status(500).json({ success: false, message: "Gagal memuat leaderboard" });
    }

    res.json({ success: true, data: scores || [] });
  } catch (err) {
    console.error("Controller GetLeaderboard Error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan internal" });
  }
};

export const getUserScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: scores, error } = await supabase
      .from('scores')
      .select('game_type, score_value, created_at')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ success: false, message: "Gagal memuat skor pengguna" });
    }

    res.json({ success: true, data: scores || [] });
  } catch (err) {
    console.error("Controller GetUserScores Error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan internal" });
  }
};
