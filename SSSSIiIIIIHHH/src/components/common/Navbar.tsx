import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Menu,
  X,
  PlusCircle,
  LogIn,
  LogOut,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, currentRole, logout, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // On login and verify-otp authentication pages, do not show the navbar
  const isAuthPage = location.pathname === '/login' || location.pathname === '/verify-otp';
  if (isAuthPage) {
    return null;
  }

  // Check if current portal is College (University), Government, or CSR / Industry
  const isCollegePortal =
    location.pathname.startsWith('/university') ||
    location.pathname.startsWith('/universities');
  const isGovernmentPortal = location.pathname.startsWith('/government');
  const isCsrPortal =
    location.pathname.startsWith('/partners') ||
    location.pathname.startsWith('/industry');

  const isOtherThreePortals = isCollegePortal || isGovernmentPortal || isCsrPortal;
  const isCitizenPortal = location.pathname.startsWith('/citizen');

  // Submit Challenge button is ALWAYS kept in citizen dashboard and workspace,
  // but REMOVED in the other three dashboards (University, Government, CSR).
  // On public pages, shown for citizens and guests, hidden if logged in as other three roles.
  const isNonCitizenRole = currentUser && currentUser.role !== 'citizen';
  const canSubmitChallenge = isCitizenPortal || (!isOtherThreePortals && !isNonCitizenRole);

  const unreadCount = notifications.filter(n => !n.read && (currentRole === 'public' || n.recipientRole === currentRole)).length;
  const filteredNotifications = notifications.filter(n => currentRole === 'public' || n.recipientRole === currentRole);

  const getDashboardPath = () => {
    switch (currentRole) {
      case 'citizen':
        return '/citizen/dashboard';
      case 'university':
        return '/university/dashboard';
      case 'government':
        return '/government/dashboard';
      case 'industry':
        return '/partners/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Main Navbar: Use full available width with responsive padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] 2xl:grid-cols-[1fr_auto_1fr] h-16 gap-2 sm:gap-3 lg:gap-5">
          {/* Brand Logo (Left) */}
          <div className="flex items-center justify-start shrink-0 pr-3 lg:pr-5">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-navy-700 flex items-center justify-center text-white shadow-md group-hover:bg-navy-800 transition-colors shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-saffron-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
              </div>
              <div className="shrink-0">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-navy-700 flex items-center gap-1">
                  Jan<span className="text-teal-600">Setu</span>
                </span>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide -mt-1 hidden sm:block">
                  From Challenges to Scalable Solutions
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Center, True Grid-Centered with Proportional Spacing) */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 2xl:gap-3 text-xs 2xl:text-sm font-medium text-slate-600 px-1 lg:px-3 min-w-0">
            <Link to="/" className="hover:text-navy-700 transition-colors whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-slate-100/70">
              Home
            </Link>
            <Link to="/explore" className="hover:text-navy-700 transition-colors whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-slate-100/70">
              <span className="hidden 2xl:inline">Explore Challenges</span>
              <span className="2xl:hidden inline">Explore</span>
            </Link>
            <Link
              to="/university/dashboard"
              className="text-purple-700 hover:text-purple-900 font-semibold transition-colors flex items-center gap-1 whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-purple-50"
            >
              <span className="hidden 2xl:inline">Lab Dashboard</span>
              <span className="2xl:hidden inline">Lab R&D</span>
              <span className="hidden 2xl:inline text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full font-bold border border-purple-200">
                R&D
              </span>
            </Link>
            <Link to="/universities" className="hover:text-navy-700 transition-colors whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-slate-100/70">
              Universities
            </Link>
            <Link to="/industry" className="hover:text-navy-700 transition-colors whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-slate-100/70">
              <span className="hidden 2xl:inline">Industry Partners</span>
              <span className="2xl:hidden inline">Industry</span>
            </Link>
            <Link to="/projects/PROJ-2026-001" className="hover:text-navy-700 transition-colors whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-slate-100/70">
              Projects
            </Link>
            <Link to="/impact" className="hover:text-navy-700 transition-colors whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-slate-100/70">
              Impact
            </Link>
            <Link to="/about" className="hover:text-navy-700 transition-colors whitespace-nowrap py-1.5 px-2 rounded-md hover:bg-slate-100/70">
              About
            </Link>
          </nav>

          {/* Actions & User State (Right) */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 pl-3 lg:pl-5">
            {/* Submit Challenge CTA: kept in citizen dashboard/portal, removed in other three dashboards */}
            {canSubmitChallenge && (
              <Link
                to="/citizen/submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-saffron-500 hover:bg-saffron-600 text-slate-950 shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Submit Challenge</span>
              </Link>
            )}

            {/* Notification Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-slate-600 hover:text-navy-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-150">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-800">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-teal-700 hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {filteredNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">No new notifications</div>
                      ) : (
                        filteredNotifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.link) {
                                navigate(n.link);
                                setNotifOpen(false);
                              }
                            }}
                            className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                              !n.read ? 'bg-navy-50/40' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-xs text-slate-900">{n.title}</span>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-teal-600"></span>}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Dashboard Access */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-navy-700 text-white text-xs font-semibold flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                      <span className="mt-1 inline-block text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                        {currentUser.role} Account
                      </span>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      Go to {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-navy-700 hover:bg-navy-800 text-white shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login / Join
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-navy-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-navy-700"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-navy-700"
          >
            Explore Challenges
          </Link>
          <Link
            to="/university/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
          >
            <span>University Lab Dashboard</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full font-bold">R&D</span>
          </Link>
          <Link
            to="/universities"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-navy-700"
          >
            Universities
          </Link>
          <Link
            to="/industry"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-navy-700"
          >
            Industry Partners
          </Link>
          <Link
            to="/projects/PROJ-2026-001"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-navy-700"
          >
            Projects Lifecycle
          </Link>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-navy-700"
          >
            Impact
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-navy-700"
          >
            About
          </Link>
          {canSubmitChallenge && (
            <Link
              to="/citizen/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-2 inline-flex justify-center items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-saffron-500 hover:bg-saffron-600 text-slate-900 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Submit a Challenge
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
