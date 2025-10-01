import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { EnvWarning } from './EnvWarning';

const navClasses = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`;

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-40">
      <EnvWarning />
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="font-bold text-lg text-brand-600">LinkingLink</Link>
        <nav className="flex items-center gap-1">
          {user && (
            <>
              <NavLink to="/dashboard" className={navClasses}>Dashboard</NavLink>
              <NavLink to="/friends" className={navClasses}>Friends</NavLink>
              <NavLink to="/feed" className={navClasses}>Feed</NavLink>
              <NavLink to="/notes" className={navClasses}>Notes</NavLink>
              <NavLink to="/chat" className={navClasses}>Chat</NavLink>
            </>
          )}
        </nav>
  <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900">Login</Link>
              <Link to="/register" className="text-sm bg-brand-600 text-white px-3 py-2 rounded-md hover:bg-brand-700">Get Started</Link>
            </>
          )}
          {user && (
            <>
              <div className="flex flex-col items-end leading-tight">
                <span className="text-xs text-slate-600">{profile?.name || user.email}</span>
                <Link to="/reset-password" className="text-[10px] underline text-slate-500 hover:text-slate-700">Reset Password</Link>
              </div>
              <button onClick={handleSignOut} className="text-sm bg-slate-200 px-3 py-2 rounded-md hover:bg-slate-300">Sign Out</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
