import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/send-money', icon: 'payments', label: 'Send Money' },
    { path: '/transactions', icon: 'history', label: 'Transactions' }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={`
        fixed left-0 top-0 border-r border-slate-100 bg-white shadow-xl shadow-slate-200/50 flex flex-col h-screen py-8 z-50
        transition-transform duration-300 ease-in-out w-[280px]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-8 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-blue-900 font-headline-md">EliteBank</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label-bold">Premium Banking</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path !== '#' ? item.path : location.pathname}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-6 py-4 transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900 sidebar-active' 
                    : 'text-slate-500 hover:text-blue-900 hover:bg-slate-50'
                  }
                `}
              >
                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span className="font-manrope text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-4 bg-slate-50 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-primary-100 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-primary text-xl">person</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-blue-900 truncate">{user?.name || 'Elite Member'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Private Client'}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-slate-500 hover:text-error hover:bg-red-50 rounded-lg transition-all duration-300"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-manrope text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen flex flex-col lg:ml-[280px]">
        {/* TopAppBar */}
        <header className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm flex justify-between items-center h-16 px-4 md:px-8 w-full">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-manrope antialiased tracking-tight text-xl font-extrabold text-blue-900 hidden sm:block">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Action items removed per user request */}
          </div>
        </header>

        {/* Content Canvas */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
