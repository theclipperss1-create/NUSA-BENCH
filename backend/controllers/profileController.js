import { z } from 'zod';
import { supabase } from '../config/supabase.js';

// Schema validation using Zod
const profileUpdateSchema = z.object({
  full_name: z.string()
    .min(3, { message: "Nama lengkap minimal 3 karakter" })
    .max(100, { message: "Nama lengkap maksimal 100 karakter" })
    .optional()
    .nullable(),
  username: z.string()
    .min(3, { message: "Username minimal 3 karakter" })
    .max(50, { message: "Username maksimal 50 karakter" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username hanya boleh mengandung huruf, angka, garis bawah, dan tanda hubung" })
    .optional()
    .nullable()
});

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      // If profile not found in DB yet, return a default mock profile using user data
      const defaultProfile = {
        id: userId,
        username: req.user.email.split('@')[0].toLowerCase(),
        full_name: req.user.email.split('@')[0],
        email: req.user.email,
        level: 1,
        xp: 0,
        avatar: "🎮",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Auto-insert default profile to simulate Postgres trigger on local DB
      await supabase.from('profiles').insert(defaultProfile);
      
      return res.json({ success: true, profile: defaultProfile });
    }

    res.json({ success: true, profile });
  } catch (err) {
    console.error("Controller GetProfile Error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil data profil" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate request body using Zod
    const parsed = profileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.issues.map(issue => ({
        field: issue.path[0],
        message: issue.message
      }));
      return res.status(400).json({
        success: false,
        message: "Validasi input gagal",
        errors: formattedErrors
      });
    }

    const { full_name, username } = parsed.data;

    // Database updates
    const dbPayload = {
      full_name,
      username,
      updated_at: new Date().toISOString()
    };

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(dbPayload)
      .eq('id', userId)
      .single();

    if (error) {
      console.error("DB Update Error:", error);
      return res.status(400).json({ success: false, message: "Gagal memperbarui profil di database" });
    }

    // Refresh data and retrieve
    const { data: latestProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    res.json({
      success: true,
      message: "Profil berhasil diperbarui",
      profile: latestProfile
    });
  } catch (err) {
    console.error("Controller UpdateProfile Error:", err);
    res.status(500).json({ success: false, message: "Gagal memperbarui profil" });
  }
};

export const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, message: "Profil tidak ditemukan" });
    }

    // Return both data and profile for compatibility
    res.json({ success: true, data: profile, profile });
  } catch (err) {
    console.error("Controller GetProfileByUsername Error:", err);
    res.status(500).json({ success: false, message: "Gagal mengambil data profil" });
  }
};
