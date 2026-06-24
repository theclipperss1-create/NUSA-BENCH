import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { gooeyToast } from 'goey-toast';

export const useProfile = () => {
  const { isAuthenticated, updateClientState } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    await Promise.resolve();
    setLoading(true);
    setErrors([]);
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Fetch profile error:', err);
      gooeyToast.error(err.message || 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateProfile = async (profileData) => {
    setLoading(true);
    setErrors([]);
    try {
      const updatePromise = api.updateProfile(profileData);

      gooeyToast.promise(updatePromise, {
        loading: 'Menyimpan pembaruan profil...',
        success: 'Profil berhasil diperbarui secara aman!',
        error: (err) => err.message || 'Gagal memperbarui profil.'
      });

      const updated = await updatePromise;
      setProfile(updated);
      
      // Update global context client name if it changed
      updateClientState({
        clientId: updated.id,
        clientName: updated.clientName,
        email: updated.email,
        createdAt: updated.updatedAt
      });

      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      // Check if it's a validation error response from Zod
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([{ message: err.message }]);
      }
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch automatically on mount or when auth state changes
  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProfile();
    });
  }, [fetchProfile]);

  return {
    profile,
    loading,
    errors,
    refetch: fetchProfile,
    updateProfile
  };
};
