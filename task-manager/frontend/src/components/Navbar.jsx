import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckSquare, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center glow-indigo">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Task<span className="text-indigo-400">Flow</span>
          </span>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 bg-zinc-900/80 px-3.5 py-1.5 rounded-lg border border-zinc-800">
              <div className="h-6 w-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-300">
                {user.username}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/60 hover:border-zinc-700/50 border border-transparent transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
