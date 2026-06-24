import { supabase } from '../config/supabase.js';

export const protectRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak: Token tidak disediakan' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Sesi tidak valid atau telah kedaluwarsa' });
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Middleware Auth Error:', err);
    return res.status(500).json({ success: false, message: 'Kesalahan otentikasi internal' });
  }
};
