import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';

export const ResetPasswordPage: React.FC = () => {
  const { requestPasswordReset, updatePassword, user } = useAuth();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<'request' | 'update'>(user ? 'update' : 'request');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(null); setError(null);
    const res = await requestPasswordReset(email);
    setLoading(false);
    if (res && res.error) setError(res.error.message); else setMessage('Password reset email sent. Check your inbox.');
  };

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setMessage(null); setError(null);
    const res = await updatePassword(newPassword);
    setLoading(false);
    if (res && res.error) setError(res.error.message); else setMessage('Password updated successfully');
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      {phase === 'request' && (
        <form onSubmit={request} className="space-y-4 bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-slate-600">Enter your account email. We'll send a reset link.</p>
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full border rounded px-3 py-2 text-sm" />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded disabled:opacity-50">{loading? 'Sending...':'Send Reset Email'}</button>
        </form>
      )}
      {phase === 'update' && (
        <form onSubmit={update} className="space-y-4 bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-slate-600">Set a new password for your account.</p>
          <input type="password" required value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="New password" className="w-full border rounded px-3 py-2 text-sm" />
          <input type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm new password" className="w-full border rounded px-3 py-2 text-sm" />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded disabled:opacity-50">{loading? 'Updating...':'Update Password'}</button>
        </form>
      )}
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {phase==='request' && user && (
        <button onClick={()=>setPhase('update')} className="text-xs underline text-slate-600">Already have reset link open? Update now.</button>
      )}
      {phase==='update' && !user && (
        <p className="text-xs text-slate-500">You must follow the reset email link to re-authenticate before updating.</p>
      )}
    </div>
  );
};

export default ResetPasswordPage;
