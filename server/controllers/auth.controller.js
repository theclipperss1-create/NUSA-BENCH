import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'super-secret-jwt-token-with-at-least-32-characters-long';

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signup = async (req, res, next) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { email, password, username, fullName = "" } = validatedData;

    if (db.isLocal()) {
      try {
        const user = await db.createUser(email, password, username, fullName);
        
        // Generate mock JWT token
        const tokenPayload = {
          sub: user.id,
          email: user.email,
          user_metadata: { username: user.username, full_name: fullName },
          role: 'authenticated',
          aud: 'authenticated'
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
          message: 'User registered successfully (Local)',
          user: { id: user.id, email: user.email, username: user.username },
          session: { access_token: token, refresh_token: 'mock-refresh-token' }
        });
      } catch (err) {
        if (err.message.includes('UNIQUE constraint failed: users.email')) {
          return res.status(400).json({ error: 'Email sudah terdaftar' });
        }
        if (err.message.includes('UNIQUE constraint failed: profiles.username')) {
          return res.status(400).json({ error: 'Username sudah digunakan' });
        }
        throw err;
      }
    } else {
      // Remote Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName
          }
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({
        message: 'User registered successfully (Supabase)',
        user: data.user,
        session: data.session
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    if (db.isLocal()) {
      try {
        const user = await db.authenticateUser(email, password);

        // Generate mock JWT token
        const tokenPayload = {
          sub: user.sub,
          email: user.email,
          user_metadata: { username: user.username },
          role: 'authenticated',
          aud: 'authenticated'
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
          message: 'Logged in successfully (Local)',
          user: { id: user.sub, email: user.email, username: user.username },
          session: { access_token: token, refresh_token: 'mock-refresh-token' }
        });
      } catch (err) {
        return res.status(401).json({ error: err.message === 'User not found' || err.message === 'Invalid password' ? 'Email atau password salah' : err.message });
      }
    } else {
      // Remote Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      res.status(200).json({
        message: 'Logged in successfully (Supabase)',
        user: data.user,
        session: data.session
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    next(error);
  }
};
