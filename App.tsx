
import React, { useState, useCallback } from 'react';
import { ModalType, ViewType, Listing, Service, Transaction } from './types';
import Modal from './components/Modal';
import { useInactivityTimer } from './hooks/useInactivityTimer';

// Mock Data
const initialListings: Listing[] = [
  { id: 1, title: 'Mature Sugarcane - Farm A', price: 100, unit: 'ton' },
  { id: 2, title: 'Freshly Harvested Cane - West Valley', price: 120, unit: 'ton' },
  { id: 3, title: 'Organic Sugarcane - Green Acres', price: 150, unit: 'ton' },
];

const initialServices: Service[] = [
  { id: 1, title: 'Tractor Ploughing', location: 'Region X' },
  { id: 2, title: 'Harvesting Crew', location: 'Region Y' },
];

const initialTransactions: Transaction[] = [
  { id: 1, title: 'Payment for Farm A Sugarcane', amount: 100, status: 'Completed' },
  { id: 2, title: 'Payment for Tractor Services', amount: 50, status: 'Completed' },
];

// Helper Components defined outside App to prevent re-creation on re-renders
const Header: React.FC<{
  onSignIn: () => void;
  onRegister: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}> = ({ onSignIn, onRegister, onLogout, isAuthenticated }) => (
  <header className="bg-green-700 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-3xl font-bold">ShambaLink</h1>
      <nav>
        {isAuthenticated ? (
          <button onClick={onLogout} className="bg-white text-green-700 px-4 py-2 rounded font-semibold hover:bg-green-100 transition-colors">
            Logout
          </button>
        ) : (
          <>
            <button onClick={onSignIn} className="bg-white text-green-700 px-4 py-2 rounded font-semibold mr-2 hover:bg-green-100 transition-colors">
              Sign In
            </button>
            <button onClick={onRegister} className="bg-green-800 text-white px-4 py-2 rounded font-semibold hover:bg-green-900 transition-colors">
              Register
            </button>
          </>
        )}
      </nav>
    </div>
  </header>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.Dashboard);

  const [listings] = useState<Listing[]>(initialListings);
  const [services] = useState<Service[]>(initialServices);
  const [transactions] = useState<Transaction[]>(initialTransactions);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    console.log('User logged out.');
  }, []);

  const { resetTimer } = useInactivityTimer(() => {
    if (isAuthenticated) {
      setActiveModal(ModalType.Inactivity);
    }
  });

  const closeModal = () => {
    setActiveModal(null);
  };
  
  const handleStayLoggedIn = () => {
      closeModal();
      resetTimer();
  };
  
  const forceLogout = () => {
      closeModal();
      handleLogout();
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case ModalType.Login:
        return (
          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); closeModal(); }}>
            <input type="email" placeholder="Email" className="border p-2 mb-4 w-full rounded-md" required />
            <input type="password" placeholder="Password" className="border p-2 mb-4 w-full rounded-md" required />
            <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors">Submit</button>
          </form>
        );
      case ModalType.AddListing:
         return (
          <form onSubmit={(e) => { e.preventDefault(); closeModal(); alert('Listing added!'); }}>
            <input type="text" placeholder="Title" className="border p-2 mb-4 w-full rounded-md" />
            <input type="number" placeholder="Price per unit" className="border p-2 mb-4 w-full rounded-md" />
            <input type="text" placeholder="Unit (e.g., ton)" className="border p-2 mb-4 w-full rounded-md" />
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">Add Listing</button>
          </form>
        );
       case ModalType.Services:
        return <p>View and add services here. This feature is coming soon!</p>;
       case ModalType.MarketPrices:
        return <p className="text-lg">Current average sugarcane price: <span className="font-bold text-green-700">$115/ton</span></p>;
       case ModalType.HowToBuy:
        return (
            <div>
                <p className="mb-4">Steps: Search for a listing, select your desired quantity, and proceed to pay securely.</p>
                <form onSubmit={(e) => { e.preventDefault(); closeModal(); alert('Buyer request submitted!'); }}>
                    <input type="text" placeholder="Submit a specific buyer request" className="border p-2 mb-4 w-full rounded-md" />
                    <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors">Submit Request</button>
                </form>
            </div>
        );
       case ModalType.GlandMeasure:
        return (
            <form onSubmit={(e) => { e.preventDefault(); closeModal(); alert('Account linked!'); }}>
                <p className="mb-4">Link your Gland Measure account to automatically sync your farm data.</p>
                <input type="text" placeholder="Auth Token" className="border p-2 mb-4 w-full rounded-md" />
                <button type="submit" className="w-full bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors">Link Account</button>
            </form>
        );
       case ModalType.Payment:
        return (
            <form onSubmit={(e) => { e.preventDefault(); closeModal(); alert('Payment initiated!'); }}>
                <p className="mb-4">You are about to purchase sugarcane. Please confirm the amount.</p>
                <input type="number" placeholder="Amount" defaultValue="100" className="border p-2 mb-4 w-full rounded-md" />
                <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors">Initiate Payment</button>
            </form>
        );
       case ModalType.Inactivity:
        return (
            <div>
                <p className="mb-4">You have been inactive. For your security, you will be logged out soon.</p>
                <div className="flex justify-end gap-4">
                    <button onClick={forceLogout} className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors">Logout</button>
                    <button onClick={handleStayLoggedIn} className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">Stay Logged In</button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };
  
  const getModalTitle = (modalType: ModalType | null): string => {
      switch (modalType) {
          case ModalType.Login: return 'Login / Register';
          case ModalType.AddListing: return 'Add New Listing';
          case ModalType.Services: return 'Available Services';
          case ModalType.MarketPrices: return 'Current Market Prices';
          case ModalType.HowToBuy: return 'How to Buy';
          case ModalType.GlandMeasure: return 'Gland Measure Integration';
          case ModalType.Payment: return 'Complete Your Purchase';
          case ModalType.Inactivity: return 'Inactivity Warning';
          default: return '';
      }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        isAuthenticated={isAuthenticated}
        onSignIn={() => setActiveModal(ModalType.Login)}
        onRegister={() => setActiveModal(ModalType.Login)}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === ViewType.Dashboard && (
           <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-semibold text-gray-700">Marketplace Listings</h3>
                 <button onClick={() => setActiveModal(ModalType.AddListing)} className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm">Add Listing</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <div key={listing.id} className="bg-white border p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-lg text-gray-900">{listing.title}</h4>
                    <p className="text-green-600 font-semibold">${listing.price}/{listing.unit}</p>
                    <button onClick={() => setActiveModal(ModalType.Payment)} className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 w-full font-semibold hover:bg-green-700 transition-colors">Buy Now</button>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-700">Services</h3>
                    <button onClick={() => setActiveModal(ModalType.Services)} className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm">View Services</button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-white border p-4 rounded-lg shadow-sm">
                            <h4 className="font-bold text-lg text-gray-900">{service.title}</h4>
                            <p className="text-gray-600">Location: {service.location}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            <div className="flex flex-wrap gap-4">
                <button onClick={() => setActiveModal(ModalType.MarketPrices)} className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition-colors shadow-sm">Market Prices</button>
                <button onClick={() => setActiveModal(ModalType.HowToBuy)} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors shadow-sm">How to Buy</button>
                <button onClick={() => setActiveModal(ModalType.GlandMeasure)} className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors shadow-sm">Gland Measure</button>
                <button onClick={() => setCurrentView(ViewType.Transactions)} className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors shadow-sm">View Transactions</button>
            </div>
           </div>
        )}
        
        {currentView === ViewType.Transactions && (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>
                    <button onClick={() => setCurrentView(ViewType.Dashboard)} className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors shadow-sm">Back to Dashboard</button>
                </div>
                <div className="space-y-4">
                    {transactions.map(tx => (
                        <div key={tx.id} className="bg-white border p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-gray-900">{tx.title}</h4>
                                <p className="text-gray-600">Amount: ${tx.amount}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{tx.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </main>
      
      <Modal
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={getModalTitle(activeModal)}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default App;
