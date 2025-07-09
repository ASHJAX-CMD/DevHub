// Navbar.jsx
import {
  Compass,
  Settings,
} from 'lucide-react';
import {
  IoIosHome,
  IoIosAddCircle,
} from 'react-icons/io';
import { LuMessageCircleMore } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/dashboard/home')) setActiveTab('Home');
    else if (path.includes('/dashboard/create')) setActiveTab('Create');
    else if (path.includes('/dashboard/explore')) setActiveTab('Explore');
    else if (path.includes('/dashboard/messages')) setActiveTab('Messages');
    else if (path.includes('/dashboard/settings')) setActiveTab('Settings');
    else setActiveTab('');
  }, [location]);

  return (
    <>
      {/* ======= Desktop Sidebar ======= */}
      <div className="hidden md:flex bg-black border-r border-white md:h-full flex-col w-20 justify-between p-4 shadow-md">
        {/* Top: Logo & Icons */}
        <div>
          <div className="w-12 h-16 mx-auto mb-6">
            <img
              src="/media/logo2.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-6 text-gray-300 flex flex-col items-center">
            <IoIosHome
              size={30}
              onClick={() => navigate('/dashboard/home')}
              style={{ color: activeTab === 'Home' ? '#16ae5d' : '' }}
              className="cursor-pointer"
            />
            <SidebarIcon
              icon={Compass}
              onClick={() => navigate('/dashboard/explore')}
              className={activeTab === 'Explore' ? 'text-[#16ae5d]' : 'text-gray-300'}
            />
            <IoIosAddCircle
              size={30}
              onClick={() => navigate('/dashboard/create')}
              style={{ color: activeTab === 'Create' ? '#16ae5d' : '' }}
              className="cursor-pointer"
            />
            <LuMessageCircleMore
              size={28}
              onClick={() => navigate('/dashboard/messages')}
              style={{ color: activeTab === 'Messages' ? '#16ae5d' : '' }}
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Bottom: Settings */}
        <div className="text-gray-300 flex justify-center">
          <SidebarIcon
            icon={Settings}
            onClick={() => navigate('/dashboard/settings')}
            className={activeTab === 'Settings' ? 'text-[#16ae5d]' : 'text-gray-300'}
          />
        </div>
      </div>

      {/* ======= Mobile Bottom Nav ======= */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center py-2 border-t border-white shadow-inner md:hidden z-50">
        <NavIcon
          active={activeTab === 'Home'}
          icon={<IoIosHome size={26} />}
          onClick={() => navigate('/dashboard/home')}
        />
        <NavIcon
          active={activeTab === 'Explore'}
          icon={<Compass size={22} />}
          onClick={() => navigate('/dashboard/explore')}
        />
        <NavIcon
          active={activeTab === 'Create'}
          icon={<IoIosAddCircle size={30} />}
          onClick={() => navigate('/dashboard/create')}
        />
        <NavIcon
          active={activeTab === 'Messages'}
          icon={<LuMessageCircleMore size={24} />}
          onClick={() => navigate('/dashboard/messages')}
        />
        <NavIcon
          active={activeTab === 'Settings'}
          icon={<Settings size={22} />}
          onClick={() => navigate('/dashboard/settings')}
        />
      </div>
    </>
  );
};

// ======= Desktop Sidebar Icon =======
const SidebarIcon = ({ icon: Icon, className = '', onClick }) => (
  <button onClick={onClick}>
    <Icon className={`w-7 h-7 ${className} cursor-pointer`} />
  </button>
);

// ======= Mobile Bottom Icon =======
const NavIcon = ({ icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center text-xs ${
      active ? 'text-[#16ae5d]' : 'text-gray-300'
    }`}
  >
    {icon}
  </button>
);

export default Navbar;
