import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../.env' }); // Load .env from root

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if we should use simulated Supabase
const useSimulated = 
  process.env.USE_LOCAL_DB === 'true' ||
  !supabaseUrl || 
  !supabaseServiceKey || 
  supabaseUrl.includes('your-supabase-url') || 
  supabaseServiceKey.includes('your-service-role-key');

// Setup mock database defaults for NusaBench
const DEFAULT_DB = {
  profiles: [
    {
      id: "cli_demo123",
      username: "player_one",
      full_name: "Player Satu",
      email: "player@nusabench.id",
      level: 1,
      xp: 0,
      avatar: "🎮",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  scores: [
    {
      id: "score_demo1",
      user_id: "cli_demo123",
      game_type: "reaction_time",
      score_value: 200,
      additional_data: {},
      created_at: new Date().toISOString()
    }
  ]
};

async function getLocalDB() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return DEFAULT_DB;
    }
  } catch (err) {
    console.error("Local DB Error:", err);
    return DEFAULT_DB;
  }
}

async function saveLocalDB(data) {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to save local DB:", err);
  }
}

// Simulated Supabase Client implementation
class SimulatedSupabaseClient {
  constructor() {
    console.log("⚠️ Menggunakan Simulasi Database (Mode Lokal). Supabase tidak terdeteksi di .env");
  }

  // Mocking auth.getUser
  auth = {
    getUser: async (token) => {
      if (!token) return { data: { user: null }, error: new Error("Token tidak disediakan") };
      const db = await getLocalDB();
      
      let clientId = null;
      let email = null;

      if (token.startsWith('simulated_jwt_token_')) {
        clientId = token.replace('simulated_jwt_token_', '');
      } else {
        // Try decoding as standard JWT to support Google OAuth tokens
        const parts = token.split('.');
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            if (payload && payload.sub) {
              clientId = payload.sub;
              email = payload.email;
            }
          } catch (e) {
            console.error("Gagal mendecode JWT token:", e);
          }
        }
      }

      if (!clientId) {
        return { data: { user: null }, error: new Error("Format token tidak valid") };
      }

      // Check if profile exists, otherwise auto-register in simulated db.json
      let profile = db.profiles.find(p => p.id === clientId || p.email === (email || clientId));
      
      if (!profile) {
        const cleanPrefix = email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : clientId.slice(0, 5);
        profile = {
          id: clientId,
          username: 'user_' + cleanPrefix,
          full_name: email ? email.split('@')[0] : 'User',
          email: email || (clientId + "@mock.com"),
          level: 1,
          xp: 0,
          avatar: "🧠",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        db.profiles.push(profile);
        await saveLocalDB(db);
      }

      return { data: { user: { id: profile.id, email: profile.email } }, error: null };
    }
  };

  from(tableName) {
    const context = this;
    return {
      select: function(columns = "*") {
        this.operation = "select";
        return this;
      },
      insert: function(values) {
        this.operation = "insert";
        this.values = values;
        return this;
      },
      update: function(values) {
        this.operation = "update";
        this.values = values;
        return this;
      },
      eq: function(column, value) {
        this.filterColumn = column;
        this.filterValue = value;
        return this;
      },
      order: function(column, { ascending = false } = {}) {
        this.orderColumn = column;
        this.ascending = ascending;
        return this;
      },
      limit: function(num) {
        this.limitNum = num;
        return this;
      },
      single: function() {
        this.isSingle = true;
        return this;
      },
      // Execute operation
      then: async function(resolve, reject) {
        try {
          const db = await getLocalDB();
          const table = db[tableName] || [];
          let resultData = null;
          let error = null;

          if (this.operation === "select") {
            if (this.filterColumn) {
              resultData = table.filter(row => row[this.filterColumn] === this.filterValue);
            } else {
              resultData = [...table];
            }
            
            // Apply sorting for leaderboards
            if (this.orderColumn) {
              resultData.sort((a, b) => {
                const valA = a[this.orderColumn];
                const valB = b[this.orderColumn];
                if (valA < valB) return this.ascending ? -1 : 1;
                if (valA > valB) return this.ascending ? 1 : -1;
                return 0;
              });
            }

            if (this.limitNum) {
              resultData = resultData.slice(0, this.limitNum);
            }

            if (tableName === 'scores') {
               // populate profile mapping for mock DB
               resultData = resultData.map(score => {
                 const userProfile = db.profiles.find(p => p.id === score.user_id);
                 return { ...score, profiles: userProfile };
               });
            }

            if (this.isSingle) {
              resultData = resultData.length > 0 ? resultData[0] : null;
            }
          } 
          
          else if (this.operation === "insert") {
            const dataToInsert = Array.isArray(this.values) ? this.values : [this.values];
            dataToInsert.forEach(row => {
              table.push(row);
            });
            db[tableName] = table;
            await saveLocalDB(db);
            resultData = this.values;
          } 
          
          else if (this.operation === "update") {
            if (this.filterColumn) {
              let updatedCount = 0;
              db[tableName] = table.map(row => {
                if (row[this.filterColumn] === this.filterValue) {
                  updatedCount++;
                  return { ...row, ...this.values, updated_at: new Date().toISOString() };
                }
                return row;
              });
              await saveLocalDB(db);
              
              // Get updated row(s)
              const updatedTable = db[tableName] || [];
              resultData = updatedTable.filter(row => row[this.filterColumn] === this.filterValue);
              if (this.isSingle) {
                resultData = resultData.length > 0 ? resultData[0] : null;
              }
            } else {
              error = new Error("Filter eq() diperlukan untuk operasi update");
            }
          }

          resolve({ data: resultData, error });
        } catch (err) {
          reject(err);
        }
      }
    };
  }
}

export const supabase = useSimulated 
  ? new SimulatedSupabaseClient() 
  : createClient(supabaseUrl, supabaseServiceKey);
