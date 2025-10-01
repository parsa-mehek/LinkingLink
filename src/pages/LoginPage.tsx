import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const emailValid = /.+@.+\..+/.test(email);
  const passwordValid = password.length >= 6;
  const formValid = emailValid && passwordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!formValid) return;
    setError(null);
    setLoading(true);
    const res = await signIn(email, password);
    if ((res as any)?.error) {
      setError((res as any).error.message || 'Login failed');
    } else {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E7EFC7] to-[#AEC8A4] px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5 border border-[#AEC8A4]">
        <h2 className="text-2xl font-bold text-[#3B3B1A]">Login</h2>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#3B3B1A]">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A784E] border-[#3B3B1A] text-sm ${touched.email && !emailValid ? 'ring-2 ring-red-500' : ''}`}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          {touched.email && !emailValid && <p className="text-xs text-red-600">Enter a valid email.</p>}
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#3B3B1A]">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, password: true }))}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A784E] border-[#3B3B1A] text-sm ${touched.password && !passwordValid ? 'ring-2 ring-red-500' : ''}`}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          {touched.password && !passwordValid && <p className="text-xs text-red-600">Password must be at least 6 characters.</p>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading || !formValid}
          className="w-full py-3 bg-[#8A784E] text-[#E7EFC7] font-semibold rounded-lg hover:bg-[#3B3B1A] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-xs text-[#3B3B1A]/70">Forgot your password? Use the reset link from the navbar once logged out.</p>
        <p className="text-sm text-[#3B3B1A]/80">Need an account? <Link to="/register" className="text-[#8A784E] hover:underline font-medium">Register</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
