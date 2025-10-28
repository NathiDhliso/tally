import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MainLayout = () => {
  const location = useLocation();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const navigation = [
    { 
      name: 'Home', 
      path: '/', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Invoices', 
      path: '/invoices', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      name: 'Clients', 
      path: '/clients', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen relative">
      {/* Layered background system */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f172a] to-[#1e293b] -z-10" />
      
      {/* Ambient gradient orbs for depth */}
      {!prefersReducedMotion && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-sage-500/5 blur-[120px]"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [-20, 20, -20],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-[120px]"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [20, -20, 20],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 3
            }}
          />
        </div>
      )}
      
      <div className="relative">
      {/* Top Bar - Desktop and Mobile - Enhanced Glass Bar */}
      <header className="fixed top-0 inset-x-0 lg:left-64 z-nav-desktop bg-white/10 backdrop-blur-2xl border-b border-sage-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between px-4 lg:px-8 py-3">
          {/* Mobile Logo */}
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden text-xl font-bold bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent"
          >
            Tally
          </motion.h1>

          {/* Search Bar with Expand Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`flex items-center gap-2 transition-all duration-300 ${
              searchExpanded ? 'flex-1 max-w-2xl' : 'max-w-fit'
            }`}
          >
            <motion.button
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              onClick={() => setSearchExpanded(!searchExpanded)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex-shrink-0"
              aria-label="Search"
            >
              <motion.svg 
                className="w-5 h-5 text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={searchExpanded ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </motion.svg>
            </motion.button>
            
            {searchExpanded && (
              <motion.input
                initial={{ opacity: 0, width: 0 }}
                animate={{ 
                  opacity: 1, 
                  width: '100%',
                  transition: { 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 30 
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  width: 0,
                  transition: { duration: 0.2 }
                }}
                type="text"
                placeholder="Search invoices, clients..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500/50 transition-all backdrop-blur-sm"
                autoFocus
                onBlur={() => setSearchExpanded(false)}
              />
            )}
          </motion.div>

          {/* Right Side Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* Notification Bell with Badge Animation */}
            <motion.button
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="Notifications"
            >
              <motion.svg 
                className="w-5 h-5 text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={!prefersReducedMotion ? {
                  rotate: [0, -10, 10, -10, 0],
                  transition: { 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 5
                  }
                } : {}}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </motion.svg>
              {/* Badge with Pulse Animation */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: { 
                    type: 'spring', 
                    stiffness: 500, 
                    damping: 15 
                  }
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-terracotta-500 to-gold-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-glow"
              >
                <motion.span
                  animate={!prefersReducedMotion ? {
                    scale: [1, 1.1, 1],
                    transition: { 
                      repeat: Infinity, 
                      duration: 2,
                      ease: 'easeInOut'
                    }
                  } : {}}
                >
                  3
                </motion.span>
              </motion.span>
              {/* Pulse Ring Animation */}
              {!prefersReducedMotion && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-terracotta-500"
                  animate={{
                    scale: [1, 1.8, 1.8],
                    opacity: [0.8, 0, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeOut',
                  }}
                />
              )}
            </motion.button>

            {/* User Avatar with Minimal Glass Effect */}
            <motion.button
              whileHover={prefersReducedMotion ? {} : { 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(107, 142, 35, 0.4)'
              }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-500 to-gold-500 flex items-center justify-center text-white font-semibold shadow-glow border-2 border-white/20 transition-shadow"
              aria-label="User menu"
            >
              <span className="text-sm">JD</span>
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Desktop Sidebar - Enhanced Glass */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-nav-desktop">
        <div className="flex flex-col flex-grow bg-white/10 backdrop-blur-2xl border-r border-sage-500/20 overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 px-6 py-5 border-b border-sage-500/20">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent"
            >
              Tally
            </motion.h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item, index) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={prefersReducedMotion ? {} : { 
                      scale: 1.02, 
                      x: 4,
                      transition: { type: 'spring', stiffness: 400, damping: 25 }
                    }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-lg 
                      transition-all duration-300 overflow-hidden
                      ${active
                        ? 'text-white font-medium shadow-glow'
                        : 'text-gray-300 hover:text-sage-400'
                      }
                    `}
                  >
                    {/* Active Background with Gradient */}
                    {active && (
                      <motion.div
                        layoutId="desktopActiveBackground"
                        className="absolute inset-0 bg-gradient-to-r from-sage-500/30 via-sage-500/20 to-gold-500/30 rounded-lg border border-sage-500/40"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Hover Background */}
                    {!active && (
                      <motion.div
                        className="absolute inset-0 bg-white/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                      />
                    )}

                    {/* Icon with Animation */}
                    <motion.div
                      className="relative z-10"
                      animate={active && !prefersReducedMotion ? {
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      } : {}}
                      whileHover={!active && !prefersReducedMotion ? {
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      } : {}}
                    >
                      {item.icon}
                    </motion.div>

                    {/* Label */}
                    <span className="relative z-10">{item.name}</span>

                    {/* Active Indicator Dot */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto relative z-10 w-2 h-2 rounded-full bg-gradient-to-b from-sage-400 to-gold-400 shadow-glow"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        animate={!prefersReducedMotion ? {
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1],
                          transition: { 
                            repeat: Infinity, 
                            duration: 2,
                            ease: 'easeInOut'
                          }
                        } : {}}
                      />
                    )}

                    {/* Subtle Glow Effect on Hover */}
                    {!active && (
                      <motion.div
                        className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(107, 142, 35, 0.1) 0%, transparent 70%)',
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Section (Optional) */}
          <div className="px-4 py-4 border-t border-sage-500/20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-500 text-center"
            >
              <p className="mb-1">Voice to Invoice</p>
              <p className="text-gray-600">v1.0.0</p>
            </motion.div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 pb-[calc(88px+env(safe-area-inset-bottom))] lg:pb-6">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation - Floating Glass Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 pb-[env(safe-area-inset-bottom)] z-nav-mobile">
        <div className="mx-4 mb-4">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-2xl border border-sage-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(107,142,35,0.1)_inset] overflow-hidden"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            }}
          >
          <div className="flex justify-around items-center px-2 py-2">
            {navigation.map((item, index) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex-1 flex justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileTap={prefersReducedMotion ? {} : { 
                      scale: 0.85,
                      transition: { type: 'spring', stiffness: 500, damping: 15 }
                    }}
                    className={`
                      relative flex flex-col items-center justify-center
                      min-h-[56px] min-w-[56px] rounded-xl
                      transition-all duration-300
                      ${active ? 'text-white' : 'text-gray-400'}
                    `}
                  >
                    {/* Active Background with Gradient */}
                    {active && (
                      <motion.div
                        layoutId="mobileActiveBackground"
                        className="absolute inset-0 bg-gradient-to-br from-sage-500/30 via-sage-500/20 to-gold-500/30 rounded-xl border border-sage-500/40"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        animate={!prefersReducedMotion ? {
                          boxShadow: [
                            '0 0 10px rgba(107, 142, 35, 0.3)',
                            '0 0 20px rgba(107, 142, 35, 0.5)',
                            '0 0 10px rgba(107, 142, 35, 0.3)',
                          ],
                          transition: {
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeInOut',
                          }
                        } : {}}
                      />
                    )}

                    {/* Tap Ripple Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-white/20 opacity-0"
                      whileTap={!prefersReducedMotion ? {
                        opacity: [0, 0.5, 0],
                        scale: [0.8, 1.2, 1],
                        transition: { duration: 0.4 }
                      } : {}}
                    />

                    {/* Icon with Enhanced Animation */}
                    <motion.div
                      className="relative z-10"
                      animate={active && !prefersReducedMotion ? {
                        y: [-2, 0, -2],
                        transition: { 
                          repeat: Infinity, 
                          duration: 2,
                          ease: 'easeInOut'
                        }
                      } : {}}
                      whileHover={!active && !prefersReducedMotion ? {
                        scale: 1.15,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      } : {}}
                    >
                      {item.icon}
                    </motion.div>

                    {/* Label with Fade */}
                    <motion.span
                      className="text-xs mt-1 relative z-10 font-medium"
                      animate={active ? {
                        opacity: 1,
                        y: 0,
                      } : {
                        opacity: 0.7,
                        y: 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>

                    {/* Active Indicator Dot */}
                    {active && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-gradient-to-b from-sage-400 to-gold-400 shadow-glow"
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        style={{
                          boxShadow: '0 0 8px rgba(107, 142, 35, 0.8)',
                        }}
                      />
                    )}

                    {/* Haptic-like Feedback Pulse */}
                    {!prefersReducedMotion && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-sage-400/0"
                        whileTap={{
                          borderColor: 'rgba(107, 142, 35, 0.6)',
                          scale: [1, 1.1, 1],
                          transition: { duration: 0.3 }
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
            </div>
          </motion.div>
        </div>
      </nav>
      </div>
    </div>
  );
};

export default MainLayout;
