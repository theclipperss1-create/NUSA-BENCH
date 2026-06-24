import { createClient } from '@supabase/supabase-js';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useLocalDb = process.env.USE_LOCAL_DB === 'true';

let sqliteDb = null;
let supabaseClient = null;

// Initialize Supabase if needed
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder_key';
supabaseClient = createClient(supabaseUrl, supabaseKey);

// Password hashing helpers
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, originalHash] = stored.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// Database Initialization
export function initDB() {
  if (!useLocalDb) {
    console.log('Database Mode: Supabase (Remote)');
    return;
  }

  console.log('Database Mode: SQLite (Local Fallback)');
  const dbDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'nusabench.db');
  sqliteDb = new Database(dbPath);

  // Enable WAL mode for performance
  sqliteDb.pragma('journal_mode = WAL');

  // Create tables
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      username TEXT UNIQUE,
      full_name TEXT,
      avatar_url TEXT,
      bio TEXT,
      phone_number TEXT,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      achievements TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      game_type TEXT NOT NULL,
      score_value REAL NOT NULL,
      additional_data TEXT DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      question_text TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      difficulty TEXT DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default questions if empty
  const count = sqliteDb.prepare('SELECT COUNT(*) as count FROM questions').get();
  if (count.count === 0) {
    const insertQuestion = sqliteDb.prepare(`
      INSERT INTO questions (id, category, question_text, options, correct_answer, explanation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const dummyQuestions = [
      {
        id: crypto.randomUUID(),
        category: 'Sejarah',
        question_text: 'Kapan Proklamasi Kemerdekaan Indonesia dibacakan?',
        options: JSON.stringify(['17 Agustus 1945', '18 Agustus 1945', '16 Agustus 1945', '20 Agustus 1945']),
        correct_answer: '17 Agustus 1945',
        explanation: 'Diproklamasikan pada 17 Agustus 1945 oleh Soekarno-Hatta.'
      },
      {
        id: crypto.randomUUID(),
        category: 'Geografi',
        question_text: 'Apa nama danau vulkanik terbesar di dunia yang terletak di Sumatera Utara?',
        options: JSON.stringify(['Danau Singkarak', 'Danau Toba', 'Danau Maninjau', 'Danau Poso']),
        correct_answer: 'Danau Toba',
        explanation: 'Danau Toba di Sumut adalah danau vulkanik terbesar di dunia.'
      },
      {
        id: crypto.randomUUID(),
        category: 'Budaya & Seni',
        question_text: 'Alat musik tradisional tiup dari bambu khas Jawa Barat/Sunda adalah...',
        options: JSON.stringify(['Angklung', 'Suling', 'Calung', 'Kecapi']),
        correct_answer: 'Angklung',
        explanation: 'Angklung adalah alat musik multitonaltubular dari bambu khas Sunda.'
      }
    ];

    for (const q of dummyQuestions) {
      insertQuestion.run(q.id, q.category, q.question_text, q.options, q.correct_answer, q.explanation);
    }
    console.log('✅ Seeded dummy questions into SQLite');
  }
}

// Unified Database API
export const db = {
  isLocal: () => useLocalDb,

  // --- Auth & Users (SQLite only, Supabase uses Auth API) ---
  createUser: async (email, password, username, fullName) => {
    if (!useLocalDb) throw new Error('Auth registration goes via Supabase Auth client');
    
    const userId = crypto.randomUUID();
    const hash = hashPassword(password);

    const insertUser = sqliteDb.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)');
    const insertProfile = sqliteDb.prepare(`
      INSERT INTO profiles (id, username, full_name, avatar_url, level, xp, games_played, achievements)
      VALUES (?, ?, ?, ?, 1, 0, 0, '[]')
    `);

    // Run as transaction
    const transaction = sqliteDb.transaction(() => {
      insertUser.run(userId, email, hash);
      insertProfile.run(userId, username, fullName, '🧠');
    });

    transaction();
    return { id: userId, email, username };
  },

  authenticateUser: async (email, password) => {
    if (!useLocalDb) throw new Error('Auth login goes via Supabase Auth client');

    const user = sqliteDb.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) throw new Error('User not found');

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) throw new Error('Invalid password');

    const profile = sqliteDb.prepare('SELECT * FROM profiles WHERE id = ?').get(user.id);
    return {
      sub: user.id,
      email: user.email,
      username: profile?.username || 'User'
    };
  },

  ensureUserExists: async (userPayload) => {
    if (!useLocalDb) return;
    const userId = userPayload.sub;
    if (!userId) return;
    const email = userPayload.email || `${userId}@placeholder.com`;
    const username = userPayload.user_metadata?.username || userPayload.user_metadata?.full_name?.replace(/\s+/g, '').toLowerCase() || `user_${userId.substring(0, 5)}`;
    const fullName = userPayload.user_metadata?.full_name || '';

    const existingUser = sqliteDb.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!existingUser) {
      const insertUser = sqliteDb.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)');
      const insertProfile = sqliteDb.prepare(`
        INSERT INTO profiles (id, username, full_name, avatar_url, level, xp, games_played, achievements)
        VALUES (?, ?, ?, ?, 1, 0, 0, '[]')
      `);

      const transaction = sqliteDb.transaction(() => {
        // Dummy hash because they authenticate via Google OAuth
        insertUser.run(userId, email, hashPassword(crypto.randomUUID()));
        insertProfile.run(userId, username, fullName, '🧠');
      });
      transaction();
    }
  },

  // --- Profiles ---
  getProfile: async (userId) => {
    if (useLocalDb) {
      const row = sqliteDb.prepare('SELECT * FROM profiles WHERE id = ?').get(userId);
      if (!row) return null;
      return {
        ...row,
        achievements: JSON.parse(row.achievements)
      };
    } else {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    }
  },

  getProfileByUsername: async (username) => {
    if (useLocalDb) {
      const row = sqliteDb.prepare('SELECT * FROM profiles WHERE username = ?').get(username);
      if (!row) return null;
      return {
        ...row,
        achievements: JSON.parse(row.achievements)
      };
    } else {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    }
  },

  updateProfile: async (userId, updateData) => {
    if (useLocalDb) {
      const sets = [];
      const values = [];
      for (const [key, val] of Object.entries(updateData)) {
        sets.push(`${key} = ?`);
        values.push(typeof val === 'object' ? JSON.stringify(val) : val);
      }
      values.push(userId);

      sqliteDb.prepare(`
        UPDATE profiles 
        SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(...values);

      return db.getProfile(userId);
    } else {
      const { data, error } = await supabaseClient
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // --- Scores ---
  submitScore: async (userId, gameType, scoreValue, additionalData = {}) => {
    const scoreId = crypto.randomUUID();

    if (useLocalDb) {
      // 1. Insert score
      sqliteDb.prepare(`
        INSERT INTO scores (id, user_id, game_type, score_value, additional_data)
        VALUES (?, ?, ?, ?, ?)
      `).run(scoreId, userId, gameType, scoreValue, JSON.stringify(additionalData));

      // 2. Fetch all scores for this game to see if it's new personal best
      const ascending = gameType === 'reaction_time';
      const order = ascending ? 'ASC' : 'DESC';
      
      // Note: for local SQLite, select all scores of this game for user
      const scores = sqliteDb.prepare(`
        SELECT score_value FROM scores 
        WHERE user_id = ? AND game_type = ? 
        ORDER BY score_value ${order}
      `).all(userId, gameType);
      
      const isNewPersonalBest = scores.length > 0 ? (scores[0].score_value === scoreValue) : true;

      // 3. Update profile xp and games played
      const profile = sqliteDb.prepare('SELECT xp, games_played, achievements FROM profiles WHERE id = ?').get(userId);
      const xpGained = 50; // standard XP reward
      const newXp = (profile?.xp || 0) + xpGained;
      const newGamesPlayed = (profile?.games_played || 0) + 1;
      
      // Calculate level
      let newLevel = 1;
      if (newXp >= 15000) newLevel = 8;
      else if (newXp >= 8000) newLevel = 7;
      else if (newXp >= 4000) newLevel = 6;
      else if (newXp >= 2000) newLevel = 5;
      else if (newXp >= 1200) newLevel = 4;
      else if (newXp >= 600) newLevel = 3;
      else if (newXp >= 200) newLevel = 2;

      const currentLevel = profile?.level || 1;
      const levelUp = newLevel > currentLevel;

      // Achievements check
      const currentAchievements = JSON.parse(profile?.achievements || '[]');
      const newAchievements = [...currentAchievements];

      if (gameType === 'reaction_time' && scoreValue < 150 && !newAchievements.includes('reaction_flash')) {
        newAchievements.push('reaction_flash');
      }
      if (gameType === 'aim_trainer' && additionalData.accuracy >= 95 && !newAchievements.includes('aim_sniper')) {
        newAchievements.push('aim_sniper');
      }
      if (gameType === 'number_memory' && scoreValue >= 12 && !newAchievements.includes('number_king')) {
        newAchievements.push('number_king');
      }
      if (gameType === 'wawasan_indonesia' && scoreValue >= 90 && !newAchievements.includes('wawasan_expert')) {
        newAchievements.push('wawasan_expert');
      }
      if (newGamesPlayed >= 10 && !newAchievements.includes('on_fire')) {
        newAchievements.push('on_fire');
      }
      if (newXp >= 2000 && !newAchievements.includes('intellect_star')) {
        newAchievements.push('intellect_star');
      }

      sqliteDb.prepare(`
        UPDATE profiles
        SET xp = ?, games_played = ?, level = ?, achievements = ?
        WHERE id = ?
      `).run(newXp, newGamesPlayed, newLevel, JSON.stringify(newAchievements), userId);

      const updatedProfile = await db.getProfile(userId);

      return {
        score: { id: scoreId, user_id: userId, game_type: gameType, score_value: scoreValue, additional_data: additionalData },
        profile: updatedProfile,
        xpGained,
        isNewPersonalBest,
        levelUp
      };
    } else {
      // Supabase write
      const { data, error } = await supabaseClient
        .from('scores')
        .insert([{
          user_id: userId,
          game_type: gameType,
          score_value: scoreValue,
          additional_data: additionalData
        }])
        .select()
        .single();
      if (error) throw error;

      // Handle XP updates on remote DB
      const { data: profileData } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
      return {
        score: data,
        profile: profileData,
        xpGained: 50,
        isNewPersonalBest: true,
        levelUp: false
      };
    }
  },

  getLeaderboard: async (gameType, limit = 100) => {
    const ascending = gameType === 'reaction_time';
    const order = ascending ? 'ASC' : 'DESC';

    if (useLocalDb) {
      const rows = sqliteDb.prepare(`
        SELECT s.score_value, s.additional_data, s.created_at, p.username, p.avatar_url
        FROM scores s
        JOIN profiles p ON s.user_id = p.id
        WHERE s.game_type = ?
        ORDER BY s.score_value ${order}
        LIMIT ?
      `).all(gameType, limit);

      return rows.map(r => ({
        score_value: r.score_value,
        additional_data: JSON.parse(r.additional_data),
        created_at: r.created_at,
        profiles: {
          username: r.username,
          avatar_url: r.avatar_url
        }
      }));
    } else {
      const { data, error } = await supabaseClient
        .from('scores')
        .select(`
          score_value,
          additional_data,
          created_at,
          profiles ( username, avatar_url )
        `)
        .eq('game_type', gameType)
        .order('score_value', { ascending })
        .limit(limit);
      if (error) throw error;
      return data;
    }
  },

  getUserScores: async (userId) => {
    if (useLocalDb) {
      const rows = sqliteDb.prepare('SELECT game_type, score_value, created_at FROM scores WHERE user_id = ?').all(userId);
      return rows;
    } else {
      const { data, error } = await supabaseClient
        .from('scores')
        .select('game_type, score_value, created_at')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    }
  },

  // --- Inquiries ---
  submitInquiry: async (inquiryData) => {
    const inquiryId = crypto.randomUUID();
    if (useLocalDb) {
      sqliteDb.prepare(`
        INSERT INTO inquiries (id, name, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
      `).run(inquiryId, inquiryData.name, inquiryData.email, inquiryData.subject || '', inquiryData.message);
      return { id: inquiryId, ...inquiryData };
    } else {
      const { data, error } = await supabaseClient
        .from('inquiries')
        .insert([inquiryData])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // --- Questions ---
  getRandomQuestions: async (category, limit = 10) => {
    if (useLocalDb) {
      let stmt;
      if (category) {
        stmt = sqliteDb.prepare(`
          SELECT id, category, question_text, options, difficulty 
          FROM questions 
          WHERE category = ? 
          ORDER BY random() 
          LIMIT ?
        `);
        const rows = stmt.all(category, limit);
        return rows.map(r => ({ ...r, options: JSON.parse(r.options) }));
      } else {
        stmt = sqliteDb.prepare(`
          SELECT id, category, question_text, options, difficulty 
          FROM questions 
          ORDER BY random() 
          LIMIT ?
        `);
        const rows = stmt.all(limit);
        return rows.map(r => ({ ...r, options: JSON.parse(r.options) }));
      }
    } else {
      let query = supabaseClient.from('questions').select('id, category, question_text, options, difficulty');
      if (category) query = query.eq('category', category);

      const { data, error } = await query.limit(limit * 5);
      if (error) throw error;

      const shuffled = data.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    }
  },

  getQuestion: async (id) => {
    if (useLocalDb) {
      const row = sqliteDb.prepare('SELECT correct_answer, explanation FROM questions WHERE id = ?').get(id);
      return row;
    } else {
      const { data, error } = await supabaseClient
        .from('questions')
        .select('correct_answer, explanation')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
  }
};
