import { useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useProfileQuery } from "../hooks/auth/query/useProfile.query";

interface TopbarProps {
  onMobileMenuToggle: () => void;
  isMobile: boolean;
}

export default function Topbar({ onMobileMenuToggle, isMobile }: TopbarProps) {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const { data: profileData } = useProfileQuery();
  const profile = profileData?.data;

  const handleLogout = () => {
    signOut();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-mgm-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl hover:bg-gray-100 text-mgm-navy transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Search bar */}
        <div className="hidden md:flex items-center w-80">
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mgm-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search transactions, grievances, consents..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-mgm-border rounded-xl outline-none focus:bg-white focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-mgm-muted bg-white border border-mgm-border rounded px-1.5 py-0.5 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-mgm-muted transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mgm-danger rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 ml-1 border-l border-mgm-border">
          <div className="w-8 h-8 rounded-xl bg-mgm-navy text-white flex items-center justify-center text-xs font-bold">
            {profile?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-mgm-navy leading-tight">
              {profile?.name || "Admin"}
            </p>
            <p className="text-[10px] text-mgm-muted capitalize">
              {profile?.roles?.[0] || "admin"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl hover:bg-red-50 text-mgm-muted hover:text-red-500 transition-colors"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
