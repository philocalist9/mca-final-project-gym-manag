'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import Image from 'next/image';
import { CheckCircle, XCircle, Bell, AlertTriangle, Clock } from 'lucide-react';

// Types
interface MembershipPlan {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  isPopular: boolean;
  features: {
    gymAccess: boolean;
    groupClasses: boolean;
    personalTrainer: number; // sessions per month
    nutritionPlan: boolean;
    saunaAccess: boolean;
    poolAccess: boolean;
  };
}

interface UserMembership {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  autoRenewal: boolean;
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  method: string;
}

// Mock data - This would come from your API in a real app
const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    duration: 1,
    price: 999,
    isPopular: false,
    features: {
      gymAccess: true,
      groupClasses: false,
      personalTrainer: 0,
      nutritionPlan: false,
      saunaAccess: false,
      poolAccess: false
    }
  },
  {
    id: 'standard',
    name: 'Standard',
    duration: 3,
    price: 899,
    isPopular: true,
    features: {
      gymAccess: true,
      groupClasses: true,
      personalTrainer: 1,
      nutritionPlan: true,
      saunaAccess: false,
      poolAccess: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    duration: 6,
    price: 799,
    isPopular: false,
    features: {
      gymAccess: true,
      groupClasses: true,
      personalTrainer: 2,
      nutritionPlan: true,
      saunaAccess: true,
      poolAccess: true
    }
  },
  {
    id: 'annual',
    name: 'Annual',
    duration: 12,
    price: 699,
    isPopular: false,
    features: {
      gymAccess: true,
      groupClasses: true,
      personalTrainer: 4,
      nutritionPlan: true,
      saunaAccess: true,
      poolAccess: true
    }
  }
];

export default function MembershipPage() {
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [userMembership, setUserMembership] = useState<UserMembership | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'current'>('plans');
  
  // Load user membership data
  useEffect(() => {
    const loadMembershipData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo, we'll create mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a mock user membership if user is logged in
        if (session?.user?.id) {
          // Sample data
          const mockMembership: UserMembership = {
            id: 'mem-123456',
            userId: session.user.id,
            planId: 'standard',
            startDate: '2023-01-15',
            endDate: '2023-04-15',
            status: 'active',
            autoRenewal: true,
            paymentHistory: [
              {
                id: 'pay-123',
                date: '2023-01-15',
                amount: 2697, // 3 months at 899/month
                status: 'success',
                method: 'Credit Card'
              }
            ]
          };
          
          setUserMembership(mockMembership);
          setActiveTab('current'); // If user has an active membership, show it
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading membership data:', error);
        setIsLoading(false);
      }
    };
    
    loadMembershipData();
  }, [session?.user?.id]);
  
  // Calculate days remaining in membership
  const calculateDaysRemaining = (): number => {
    if (!userMembership) return 0;
    
    const today = new Date();
    const endDate = new Date(userMembership.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Handle plan selection
  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };
  
  // Handle payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to your payment gateway
    // For demo, we'll simulate success
    
    // Create a new membership or update existing one
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (selectedPlan?.duration || 0));
    
    const newMembership: UserMembership = {
      id: userMembership?.id || `mem-${Date.now()}`,
      userId: session?.user?.id || 'unknown',
      planId: selectedPlan?.id || 'unknown',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'active',
      autoRenewal: true,
      paymentHistory: [
        ...(userMembership?.paymentHistory || []),
        {
          id: `pay-${Date.now()}`,
          date: startDate.toISOString().split('T')[0],
          amount: (selectedPlan?.price || 0) * (selectedPlan?.duration || 0),
          status: 'success',
          method: 'Credit Card'
        }
      ]
    };
    
    setUserMembership(newMembership);
    setShowPaymentModal(false);
    setActiveTab('current');
  };
  
  // Handle renewal toggle
  const handleRenewalToggle = () => {
    if (userMembership) {
      setUserMembership({
        ...userMembership,
        autoRenewal: !userMembership.autoRenewal
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Membership</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your gym membership plan and subscription</p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'plans' 
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('plans')}
          >
            Available Plans
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'current' 
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('current')}
            disabled={!userMembership}
          >
            My Membership
          </button>
        </div>
        
        {/* Available Plans */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border ${
                  plan.isPopular ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{plan.price}</span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {plan.duration} {plan.duration === 1 ? 'month' : 'months'} plan
                  </p>
                  
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Gym Access</p>
                    </li>
                    
                    <li className="flex items-start">
                      {plan.features.groupClasses ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Group Classes</p>
                    </li>
                    
                    <li className="flex items-start">
                      {plan.features.personalTrainer > 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        {plan.features.personalTrainer > 0 
                          ? `${plan.features.personalTrainer} Personal Training ${plan.features.personalTrainer === 1 ? 'Session' : 'Sessions'}/month`
                          : 'No Personal Training'}
                      </p>
                    </li>
                    
                    <li className="flex items-start">
                      {plan.features.nutritionPlan ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Nutrition Plan</p>
                    </li>
                    
                    <li className="flex items-start">
                      {plan.features.saunaAccess ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Sauna Access</p>
                    </li>
                    
                    <li className="flex items-start">
                      {plan.features.poolAccess ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">Pool Access</p>
                    </li>
                  </ul>
                  
                  <div className="mt-8">
                    <button
                      onClick={() => handlePlanSelect(plan)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
                    >
                      {userMembership?.planId === plan.id 
                        ? 'Renew Membership' 
                        : userMembership 
                          ? 'Change Plan' 
                          : 'Subscribe Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Current Membership */}
        {activeTab === 'current' && userMembership && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Active Membership</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {MEMBERSHIP_PLANS.find(p => p.id === userMembership.planId)?.name || 'Unknown'} Plan
                    ({MEMBERSHIP_PLANS.find(p => p.id === userMembership.planId)?.duration || 0} {
                      MEMBERSHIP_PLANS.find(p => p.id === userMembership.planId)?.duration === 1 ? 'Month' : 'Months'
                    })
                  </h3>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(userMembership.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(userMembership.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex flex-col items-center">
                  <div className={`text-lg font-bold px-4 py-2 rounded-full ${
                    userMembership.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : userMembership.status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userMembership.status.charAt(0).toUpperCase() + userMembership.status.slice(1)}
                  </div>
                  
                  {userMembership.status === 'active' && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                      <p className="font-bold text-gray-900 dark:text-white">{calculateDaysRemaining()} days</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Auto-Renewal</span>
                    <div className="relative inline-block w-10 ml-3 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="auto-renewal" 
                        id="auto-renewal" 
                        className="sr-only"
                        checked={userMembership.autoRenewal}
                        onChange={handleRenewalToggle}
                      />
                      <label 
                        htmlFor="auto-renewal" 
                        className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                          userMembership.autoRenewal ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span 
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            userMembership.autoRenewal ? 'translate-x-4' : 'translate-x-0'
                          }`} 
                        />
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setActiveTab('plans');
                      const currentPlan = MEMBERSHIP_PLANS.find(p => p.id === userMembership.planId);
                      if (currentPlan) {
                        setSelectedPlan(currentPlan);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
                  >
                    Renew/Change Plan
                  </button>
                </div>
                
                {userMembership.status === 'active' && calculateDaysRemaining() <= 7 && (
                  <div className="mt-4 flex items-start p-4 bg-yellow-50 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <p className="ml-3 text-sm text-yellow-700">
                      Your membership is expiring soon. {userMembership.autoRenewal 
                        ? 'Your plan will be automatically renewed on expiry.' 
                        : 'Please renew to avoid interruption.'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment History</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {userMembership.paymentHistory.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(payment.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{payment.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'success' 
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{payment.method}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Complete Your Subscription</h2>
            
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Plan:</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedPlan.name} ({selectedPlan.duration} {selectedPlan.duration === 1 ? 'Month' : 'Months'})</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Price per month:</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Duration:</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedPlan.duration} {selectedPlan.duration === 1 ? 'month' : 'months'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Total:</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{selectedPlan.price * selectedPlan.duration}</span>
              </div>
            </div>
            
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  placeholder="**** **** **** ****" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    id="expiryDate" 
                    placeholder="MM/YY" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                  <input 
                    type="text" 
                    id="cvv" 
                    placeholder="***" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name on Card</label>
                <input 
                  type="text" 
                  id="nameOnCard" 
                  placeholder="John Doe" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="autoRenewal" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="autoRenewal" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable auto-renewal (can be changed later)
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Pay ₹{selectedPlan.price * selectedPlan.duration}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 