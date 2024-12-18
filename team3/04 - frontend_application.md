```tsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Menu, CircleUser, MessageCircle, BarChart, CreditCard, LayoutDashboard } from 'lucide-react';

// Custom Hook for Authentication
const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate authentication check
    const checkAuthentication = async () => {
      try {
        // Simulated auth check - replace with actual authentication logic
        const mockUser = {
          id: '123',
          name: 'John Doe',
          role: 'client',
          credits: 5000
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Authentication failed', error);
        setUser(null);
      }
    };

    checkAuthentication();
  }, []);

  return user;
};

// Simple Notification Context
const NotificationContext = createContext({
  showNotification: () => {},
  hideNotification: () => {}
});

// Notification Provider Component
const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    // Auto-hide after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={hideNotification}>×</button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Main Application Component
const BulkSMSApplication = () => {
  const user = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');

  // Render different modules based on user role and selected menu item
  const renderActiveModule = () => {
    if (!user) return <div>Loading...</div>;

    switch(activeModule) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'campaigns':
        return <CampaignBuilder user={user} />;
      case 'contacts':
        return <ContactManager user={user} />;
      case 'reports':
        return <ReportingDashboard user={user} />;
      case 'billing':
        return <BillingSection user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!user) return <div>Authenticating...</div>;

  return (
    <NotificationProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <nav className="p-4">
            <ul>
              {[
                { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { key: 'campaigns', label: 'SMS Campaigns', icon: MessageCircle },
                { key: 'contacts', label: 'Contacts', icon: CircleUser },
                { key: 'reports', label: 'Reports', icon: BarChart },
                { key: 'billing', label: 'Billing', icon: CreditCard }
              ].map(item => (
                <li 
                  key={item.key}
                  className={`p-2 mb-2 cursor-pointer hover:bg-gray-700 ${activeModule === item.key ? 'bg-gray-700' : ''}`}
                  onClick={() => setActiveModule(item.key)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-2" />
                    {item.label}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {renderActiveModule()}
        </div>
      </div>
    </NotificationProvider>
  );
};

// Dashboard Component
const Dashboard = ({ user }) => {
  const { showNotification } = useContext(NotificationContext);

  const dashboardStats = {
    totalSMSsSent: 15342,
    activeCampaigns: 5,
    remainingCredits: user.credits
  };

  useEffect(() => {
    if (dashboardStats.remainingCredits < 1000) {
      showNotification('Low SMS credits. Please recharge!', 'warning');
    }
  }, [dashboardStats.remainingCredits]);

  return (
    <div className="dashboard grid grid-cols-3 gap-4">
      <StatCard 
        title="Total SMS Sent" 
        value={dashboardStats.totalSMSsSent} 
        className="bg-blue-100"
      />
      <StatCard 
        title="Active Campaigns" 
        value={dashboardStats.activeCampaigns} 
        className="bg-green-100"
      />
      <StatCard 
        title="Remaining Credits" 
        value={dashboardStats.remainingCredits} 
        className="bg-red-100"
      />
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, className = '' }) => (
  <div className={`p-4 rounded-lg shadow-md ${className}`}>
    <h3 className="text-gray-600 mb-2">{title}</h3>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

// Campaign Builder Component (Simplified)
const CampaignBuilder = ({ user }) => {
  const { showNotification } = useContext(NotificationContext);
  const [campaignDetails, setCampaignDetails] = useState({
    name: '',
    message: '',
    recipients: []
  });

  const handleCreateCampaign = () => {
    try {
      // Simulated campaign creation
      console.log('Campaign Created:', campaignDetails);
      showNotification('Campaign Created Successfully', 'success');
    } catch (error) {
      showNotification('Failed to Create Campaign', 'error');
    }
  };

  return (
    <div className="campaign-builder bg-white p-6 rounded-lg">
      <h2 className="text-xl mb-4">Create SMS Campaign</h2>
      <input 
        type="text"
        placeholder="Campaign Name"
        className="w-full p-2 mb-4 border rounded"
        value={campaignDetails.name}
        onChange={(e) => setCampaignDetails({
          ...campaignDetails, 
          name: e.target.value
        })}
      />
      <textarea 
        placeholder="Your SMS Message"
        className="w-full p-2 mb-4 border rounded"
        value={campaignDetails.message}
        onChange={(e) => setCampaignDetails({
          ...campaignDetails, 
          message: e.target.value
        })}
      />
      <button 
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleCreateCampaign}
      >
        Create Campaign
      </button>
    </div>
  );
};

// Placeholder Components
const ContactManager = () => (
  <div>Contact Management Coming Soon</div>
);

const ReportingDashboard = () => (
  <div>Reporting Dashboard Coming Soon</div>
);

const BillingSection = () => (
  <div>Billing Section Coming Soon</div>
);

export default BulkSMSApplication;

```

Key Changes:
1. Removed custom `./components` and `./services` imports
2. Used built-in React hooks and context
3. Utilized Lucide React icons for interface elements
4. Added Tailwind-like utility classes for styling
5. Implemented custom hooks and contexts
6. Created simplified, self-contained components
7. Added basic notification mechanism
8. Used simulated data and methods

The application now has:
- Authentication simulation
- Notification context
- Modular component structure
- Basic routing between application modules
- Tailwind-like styling

Would you like me to elaborate on any specific aspect of the implementation?