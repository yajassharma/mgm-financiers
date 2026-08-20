import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ROUTES from "../enum/routes";
import logo from "../assets/images/logo.png";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
  isMobile: boolean;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    path: ROUTES.DASHBOARD,
  },
  {
    label: "Payments",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    path: "/payments",
    children: [
      { label: "Payment Dashboard", path: ROUTES.PAYMENT_DASHBOARD },
      { label: "Transactions", path: ROUTES.PAYMENTS },
    ],
  },
  {
    label: "Grievance Redressal",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    path: "/grievances",
    children: [
      { label: "Grievance Dashboard", path: ROUTES.GRIEVANCE_DASHBOARD },
      { label: "All Grievances", path: ROUTES.GRIEVANCES },
    ],
  },
  {
    label: "Loan Leads",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    path: "/leads",
    children: [
      { label: "Lead Dashboard", path: ROUTES.LEAD_DASHBOARD },
      { label: "All Leads", path: ROUTES.LEADS },
    ],
  },
  {
    label: "Consent Verification",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    path: ROUTES.CONSENTS,
  },
  {
    label: "Settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    path: ROUTES.SETTINGS,
  },
];

export default function Sidebar({
  collapsed,
  onToggle,
  onMobileClose,
  isMobile,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Payments", "Grievance Redressal"]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isSectionActive = (item: NavItem) =>
    item.children?.some((child) => location.pathname === child.path) ||
    location.pathname === item.path;

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) onMobileClose();
  };

  return (
    <aside
      className={`flex flex-col h-full bg-white border-r border-mgm-border transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[280px]"
      } ${isMobile ? "w-[280px]" : ""}`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-mgm-border ${collapsed ? "justify-center px-2" : "px-5"}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img src={logo} alt="MGM" className="w-8 h-8 object-contain" />
            <div>
              <span className="text-sm font-bold text-mgm-navy tracking-tight">
                MGM Financiers
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-mgm-gold font-semibold">
                Admin Panel
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <img src={logo} alt="MGM" className="w-8 h-8 object-contain" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isSectionActive(item);
          const expanded = expandedSections.includes(item.label);

          return (
            <div key={item.label}>
              {/* Main nav item */}
              <button
                onClick={() => {
                  if (item.children) {
                    if (collapsed) {
                      toggleSection(item.label);
                    } else {
                      toggleSection(item.label);
                      if (!active) handleNav(item.children[0].path);
                    }
                  } else {
                    handleNav(item.path);
                  }
                }}
                className={`w-full flex items-center gap-3 rounded-xl transition-all duration-150 group ${
                  collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"
                } ${
                  active
                    ? "bg-mgm-navy text-white"
                    : "text-mgm-muted hover:bg-gray-50 hover:text-mgm-navy"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`flex-shrink-0 ${active ? "text-white" : "text-mgm-muted group-hover:text-mgm-navy"}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                    {item.children && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expanded ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </>
                )}
              </button>

              {/* Children */}
              {item.children && !collapsed && expanded && (
                <div className="ml-4 mt-1 space-y-0.5 pl-3 border-l border-mgm-border">
                  {item.children.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => handleNav(child.path)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive(child.path)
                          ? "bg-mgm-gold/10 text-mgm-gold"
                          : "text-mgm-muted hover:bg-gray-50 hover:text-mgm-navy"
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <div className="px-3 py-3 border-t border-mgm-border">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-mgm-muted hover:bg-gray-50 hover:text-mgm-navy transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
