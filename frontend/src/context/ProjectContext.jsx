/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { gooeyToast } from 'goey-toast';

const ProjectContext = createContext(null);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const projs = await api.getProjects();
      const invs = await api.getInvoices();
      setProjects(projs);
      setInvoices(invs);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      gooeyToast.error("Gagal menyinkronkan data dengan sistem.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load session from localStorage on mount
  useEffect(() => {
    const currentSession = api.getCurrentSession();
    if (currentSession) {
      Promise.resolve().then(() => {
        setSession(currentSession);
      });
    }
  }, []);

  // Fetch projects and invoices when session changes
  useEffect(() => {
    if (session) {
      Promise.resolve().then(() => {
        fetchData();
      });
    } else {
      Promise.resolve().then(() => {
        setProjects([]);
        setInvoices([]);
      });
    }
  }, [session, fetchData]);

  const handleLogin = async (email) => {
    setLoading(true);
    const loginPromise = api.login(email);
    
    gooeyToast.promise(loginPromise, {
      loading: 'Menghubungkan ke sistem NUSA-BENCH...',
      success: (user) => {
        setSession(user);
        return `Selamat datang kembali, ${user.clientName}!`;
      },
      error: (err) => err.message || 'Login gagal.'
    });

    try {
      await loginPromise;
    } catch {
      // Handled in promise toast
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setSession(null);
    gooeyToast.info("Anda telah keluar dari sesi.");
  };

  const handleCreateProject = async (projectData) => {
    setLoading(true);
    const createPromise = api.createProject(projectData);

    gooeyToast.promise(createPromise, {
      loading: 'Mengunggah spesifikasi proyek ke cloud...',
      success: 'Pesanan proyek berhasil terdaftar! Silakan lakukan pembayaran Down Payment di dashboard.',
      error: (err) => err.message || 'Gagal mendaftarkan proyek.'
    });

    try {
      const newProj = await createPromise;
      // Refresh local state
      await fetchData();
      return newProj;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    setLoading(true);
    const payPromise = api.payInvoice(invoiceId);

    gooeyToast.promise(payPromise, {
      loading: 'Mengamankan transaksi pembayaran...',
      success: 'Pembayaran invoice berhasil diverifikasi secara instan!',
      error: 'Pembayaran gagal.'
    });

    try {
      await payPromise;
      await fetchData();
    } catch {
      // Handled in promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider value={{
      session,
      projects,
      invoices,
      loading,
      login: handleLogin,
      logout: handleLogout,
      createProject: handleCreateProject,
      payInvoice: handlePayInvoice,
      refreshData: fetchData
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
