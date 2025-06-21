import {
  Home as HomeIcon,
  Compass,
  MessageSquare,
  PlusSquare,
  Bell,
  Settings,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosHome, IoIosAddCircle } from 'react-icons/io';
import { LuMessageCircleMore } from 'react-icons/lu';
import React from 'react';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();

  // Set activeTab based on URL
  useEffect(() => {
    const path = location.pathname.toLowerCase();

    if (path.includes('/dashboard/home')) setActiveTab('Home');
    else if (path.includes('/dashboard/create')) setActiveTab('Create');
    else if (path.includes('/dashboard/explore')) setActiveTab('Explore');
    else if (path.includes('/dashboard/messages')) setActiveTab('Messages');
    else if (path.includes('/dashboard/alerts')) setActiveTab('Alerts');
    else setActiveTab('');
  }, [location]);

  return (
    <div className="bg-white border-r border-[rgba(0,0,0,0.4)] h-full flex flex-col w-auto justify-between p-4 shadow-md">
      {/* Top section with logo + nav icons */}
      <div>
        {/* Logo */}
<div className="w-16  h-24">
  <img
    src="/media/logo2.png"
    alt="Logo"
    className="w-full h-full object-contain"
  />
</div>

        {/* Navigation Icons */}
        <div className="space-y-6 text-gray-700">
          <IoIosHome
            size={35}
            onClick={() => navigate('/dashboard/home')}
            style={{
              color: activeTab === 'Home' ? '#16ae5d' : '#000',
            }}
          />

          <SidebarIcon
            icon={Compass}
           
            onClick={() => navigate('/dashboard/explore')}
            className={activeTab === 'Explore' ? 'text-[#16ae5d]' : ''}
          />

          <IoIosAddCircle
            size={35}
            onClick={() => navigate('/dashboard/create')}
            style={{
              color: activeTab === 'Create' ? '#16ae5d' : '#000',
            }}
          />

          <LuMessageCircleMore
            size={35}
            onClick={() => navigate('/dashboard/messages')}
            style={{
              color: activeTab === 'Messages' ? '#16ae5d' : '#000',
            }}
          />

          <SidebarIcon
            icon={Bell}
            
            onClick={() => navigate('/dashboard/alerts')}
            className={activeTab === 'Alerts' ? 'text-[#16ae5d]' : ''}
          />
        </div>
      </div>

      {/* Bottom section with settings icon */}
      <div className="text-black-700">
        <SidebarIcon icon={Settings}  onClick={() => navigate('/dashboard/settings')} />
      </div>
    </div>
  );
};

// SidebarIcon Component
const SidebarIcon = ({ icon: Icon, label, className = '', onClick }) => (
  <div
    className={`flex items-center space-x-3 cursor-pointer transition ${className}`}
    onClick={onClick}
  >
    <Icon className="w-8 h-8" />
    {label && <span className="text-sm">{label}</span>}
  </div>
);

export default Navbar;
