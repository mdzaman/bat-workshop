import React, { useState, useRef } from 'react';
import { 
  Home, 
  CreditCard, 
  Share2, 
  User, 
  Settings, 
  QrCode, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Download 
} from 'lucide-react';

const VCardModernUI = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Responsive Sidebar Toggle */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md p-2 rounded-full"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static z-40 
        w-64 h-full 
        bg-white 
        shadow-xl 
        transform 
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 
        transition-transform 
        duration-300 
        ease-in-out
      `}>
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center">
            <QrCode className="mr-3" size={32} />
            <h1 className="text-2xl font-bold">V-Card</h1>
          </div>
          <p className="text-sm mt-2 opacity-75">Your Digital Business Card</p>
        </div>

        <nav className="mt-8 px-4">
          {[
            { 
              name: 'Dashboard', 
              icon: <Home />, 
              section: 'dashboard' 
            },
            { 
              name: 'Create Card', 
              icon: <Plus />, 
              section: 'create' 
            },
            { 
              name: 'My Cards', 
              icon: <CreditCard />, 
              section: 'mycards' 
            },
            { 
              name: 'Share', 
              icon: <Share2 />, 
              section: 'share' 
            },
            { 
              name: 'Profile', 
              icon: <User />, 
              section: 'profile' 
            },
            { 
              name: 'Settings', 
              icon: <Settings />, 
              section: 'settings' 
            }
          ].map((item) => (
            <button 
              key={item.section}
              onClick={() => {
                setActiveSection(item.section);
                setIsMenuOpen(false);
              }}
              className={`
                w-full flex items-center 
                p-3 rounded-lg my-2
                ${activeSection === item.section 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'}
                transition duration-200
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 p-6 md:p-10 overflow-y-auto">
        {activeSection === 'dashboard' && <DashboardSection />}
        {activeSection === 'create' && <CardCreationSection />}
        {activeSection === 'mycards' && <MyCardsSection />}
        {activeSection === 'share' && <ShareSection />}
        {activeSection === 'profile' && <ProfileSection />}
        {activeSection === 'settings' && <SettingsSection />}
      </main>
    </div>
  );
};

// Dashboard Section
const DashboardSection = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        {[
          { 
            title: 'Total Cards', 
            value: '8', 
            icon: <CreditCard className="text-blue-500" />,
            bg: 'bg-blue-50'
          },
          { 
            title: 'Total Shares', 
            value: '42', 
            icon: <Share2 className="text-green-500" />,
            bg: 'bg-green-50'
          },
          { 
            title: 'Profile Views', 
            value: '156', 
            icon: <User className="text-purple-500" />,
            bg: 'bg-purple-50'
          }
        ].map((stat) => (
          <div 
            key={stat.title} 
            className={`
              ${stat.bg} 
              p-6 rounded-xl 
              shadow-md 
              hover:shadow-lg 
              transition 
              duration-300
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Recent Activity</h3>
          <button className="
            bg-blue-500 
            text-white 
            px-4 py-2 
            rounded-lg 
            hover:bg-blue-600 
            transition 
            duration-300
            flex items-center
          ">
            <Plus className="mr-2" /> Create New Card
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((card) => (
            <div 
              key={card} 
              className="
                bg-white 
                rounded-xl 
                shadow-md 
                p-6 
                hover:shadow-lg 
                transition 
                duration-300
              "
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Professional Card</h4>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <div className="flex items-center">
                <div className="
                  w-16 h-16 
                  bg-blue-100 
                  rounded-full 
                  mr-4 
                  overflow-hidden
                ">
                  <img 
                    src="/api/placeholder/64/64" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-800">John Doe</p>
                  <p className="text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Card Creation Section
const CardCreationSection = () => {
  const [step, setStep] = useState(1);
  const [cardDetails, setCardDetails] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: ''
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Create Your Digital Card
      </h2>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Personal Details</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="
                w-full 
                p-3 
                border 
                border-gray-300 
                rounded-lg 
                focus:ring-2 
                focus:ring-blue-500 
                focus:outline-none
              "
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Job Title"
              className="
                w-full 
                p-3 
                border 
                border-gray-300 
                rounded-lg 
                focus:ring-2 
                focus:ring-blue-500 
                focus:outline-none
              "
              value={cardDetails.title}
              onChange={(e) => setCardDetails({...cardDetails, title: e.target.value})}
            />
            {/* More input fields */}
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setStep(2)}
              className="
                bg-blue-500 
                text-white 
                px-6 py-3 
                rounded-lg 
                hover:bg-blue-600 
                transition 
                duration-300
              "
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Design Your Card</h3>
          {/* Card design options */}
        </div>
      )}
    </div>
  );
};

// Card Share Section
const ShareSection = () => {
  const linkRef = useRef(null);

  const copyToClipboard = () => {
    if (linkRef.current) {
      navigator.clipboard.writeText(linkRef.current.value);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Share Your Card</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-semibold mb-6">Sharing Options</h3>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-3">
              <input
                ref={linkRef}
                type="text"
                readOnly
                value="https://vcard.me/johndoe"
                className="flex-1 bg-transparent outline-none"
              />
              <button 
                onClick={copyToClipboard}
                className="ml-2 text-blue-500 hover:text-blue-600"
              >
                <Copy />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="
                w-full 
                bg-blue-500 
                text-white 
                p-3 
                rounded-lg 
                hover:bg-blue-600 
                flex 
                items-center 
                justify-center
              ">
                <QrCode className="mr-2" /> Generate QR
              </button>
              <button className="
                w-full 
                bg-green-500 
                text-white 
                p-3 
                rounded-lg 
                hover:bg-green-600 
                flex 
                items-center 
                justify-center
              ">
                <Download className="mr-2" /> Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-semibold mb-6">Share Analytics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Views', value: '42', color: 'text-blue-600' },
              { label: 'Unique Visitors', value: '28', color: 'text-green-600' },
              { label: 'Shares', value: '15', color: 'text-purple-600' },
              { label: 'Countries', value: '5', color: 'text-orange-600' }
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="
                  bg-gray-50 
                  p-4 
                  rounded-lg 
                  text-center 
                  hover:shadow-md 
                  transition
                "
              >
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCardModernUI;
