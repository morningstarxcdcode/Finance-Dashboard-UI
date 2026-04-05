import type { ReactNode } from 'react';
import type { Role, ThemeMode } from '../types';

type TopBarProps = {
  activeTab: string;
  navigationTabs: string[];
  role: Role;
  theme: ThemeMode;
  onTabChange: (tab: string) => void;
  onRoleChange: (role: Role) => void;
  onThemeChange: (theme: ThemeMode) => void;
  onQuickAction: (action: string) => void;
};

export function DashboardShell({ children }: { children: ReactNode }) {
  return <main className="app-shell">{children}</main>;
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6.5 6.5 0 0 0 0 13 7 7 0 1 1 0-13Z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 0 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h11" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2.1.8 3a2 2 0 0 1-.4 2.1l-1.2 1.2a16 16 0 0 0 5.7 5.7l1.2-1.2a2 2 0 0 1 2.1-.4c1 .4 2 .7 3 .8a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 10h18" />
      <path d="M16 14h2" />
    </svg>
  );
}

export function TopBar({ activeTab, navigationTabs, role, theme, onTabChange, onRoleChange, onThemeChange, onQuickAction }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <IconWallet />
        </div>
        <div>
          <h1 className="brand-title">Aurora Finance</h1>
          <p className="brand-subtitle">Smart workspace analytics</p>
        </div>
      </div>

      <nav className="nav-pill" aria-label="Primary navigation">
        {navigationTabs.map((tab) => (
          <button key={tab} type="button" className={tab === activeTab ? 'active' : ''} onClick={() => onTabChange(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      <div className="topbar-actions">
        <div className="icon-row desktop-only" aria-label="Quick actions">
          <button type="button" className="icon-button" aria-label="Calls" onClick={() => onQuickAction('Calls')}>
            <IconPhone />
          </button>
          <button type="button" className="icon-button" aria-label="Calendar" onClick={() => onQuickAction('Calendar')}>
            <IconCalendar />
          </button>
          <button type="button" className="icon-button" aria-label="Search" onClick={() => onQuickAction('Search')}>
            <IconSearch />
          </button>
          <button type="button" className="icon-button" aria-label="Alerts" onClick={() => onQuickAction('Alerts')}>
            <IconBell />
          </button>
        </div>

        <button
          type="button"
          className="theme-button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <IconMoon /> : <IconSun />}
        </button>

        <div className="role-switcher" aria-label="Role switcher">
          <button type="button" className={role === 'viewer' ? 'role-button active' : 'role-button'} onClick={() => onRoleChange('viewer')}>
            Viewer
          </button>
          <button type="button" className={role === 'admin' ? 'role-button active' : 'role-button'} onClick={() => onRoleChange('admin')}>
            Admin
          </button>
        </div>

        <div className="profile-pill">
          <img
            alt="James profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFtJHWXPEsbKcYDHWeEY0HzeDaOPwOL2Ida6vkTJXblvse2Z1ndAR0NDUsGbwJAFSRFGU7e3sjBfOK3VpiXp4pgApCCJtT0xKzulq03srE0GjALd3K3uj02DhPvOgxzduIP1J4FNR8Ff958X6oLdzLF2_FxmrWdUqXhBW0fhHw-R4hsdQ0D63MqvhuCh-__dUOdZis-8w9q-U1iv2PdNEMIid9M9iWswk9CR5B_HcXnI_fUN8nogLw7djwFU5t_eeICByUW4sveMk"
          />
          <span className="profile-name">James</span>
          <span className="helper-copy">⌄</span>
        </div>
      </div>
    </header>
  );
}