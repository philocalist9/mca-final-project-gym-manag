'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import { UserRole } from '@/models/ClientUser';
import { CalendarIcon, ClockIcon, UserIcon, ClipboardIcon, CheckCircleIcon, XCircleIcon, Clock3Icon } from 'lucide-react';

// Types
interface Trainer {
  id: string;
  name: string;
  specialization: string;
  availability: {
    [date: string]: string[]; // date: array of available time slots
  };
  image?: string;
}

type SessionType = 'personal-training' | 'diet-consultation' | 'progress-review' | 'physiotherapy';

interface SessionTypeInfo {
  id: SessionType;
  name: string;
  icon: React.ReactNode;
  description: string;
  duration: number; // in minutes
}

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'requested';

interface Appointment {
  id: string;
  trainerId: string;
  clientId: string;
  sessionType: SessionType;
  date: string;
  time: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes?: string;
  feedback?: string;
  createdAt: string;
}

// Session types information
const sessionTypes: SessionTypeInfo[] = [
  {
    id: 'personal-training',
    name: 'Personal Training',
    icon: <UserIcon className="w-5 h-5" />,
    description: 'One-on-one training session tailored to your fitness goals.',
    duration: 60
  },
  {
    id: 'diet-consultation',
    name: 'Diet Consultation',
    icon: <ClipboardIcon className="w-5 h-5" />,
    description: 'Personalized nutritional guidance and meal planning.',
    duration: 45
  },
  {
    id: 'progress-review',
    name: 'Progress Review',
    icon: <CheckCircleIcon className="w-5 h-5" />,
    description: 'Evaluation of your progress and adjustment of your fitness plan.',
    duration: 30
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    icon: <UserIcon className="w-5 h-5" />,
    description: 'Rehabilitation and prevention of injuries related to exercise.',
    duration: 60
  }
];

export default function AppointmentsPage() {
  const { session } = useSession();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'book' | 'upcoming' | 'past' | 'all'>('book');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Form state
  const [bookingForm, setBookingForm] = useState({
    trainerId: '',
    sessionType: 'personal-training' as SessionType,
    date: '',
    time: '',
    notes: ''
  });
  
  // UI state
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Utility function to format dates
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get the time from a datetime string (HH:MM format)
  const formatTimeOnly = (timeString: string): string => {
    const date = new Date(`2000-01-01T${timeString}`);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Check if the current user is a trainer
  const isTrainer = (): boolean => {
    return session?.user?.role === UserRole.TRAINER || session?.user?.role === UserRole.ADMIN;
  };

  // Load mock data
  useEffect(() => {
    const loadMockData = () => {
      setIsLoading(true);

      // Generate mock trainers
      const mockTrainers: Trainer[] = [
        {
          id: 'trainer-1',
          name: 'Alex Johnson',
          specialization: 'Strength Training',
          image: '/default-avatar.svg',
          availability: generateAvailability(60) // 60 days of availability
        },
        {
          id: 'trainer-2',
          name: 'Sarah Williams',
          specialization: 'Nutrition & Diet',
          image: '/default-avatar.svg',
          availability: generateAvailability(60)
        },
        {
          id: 'trainer-3',
          name: 'Michael Chen',
          specialization: 'Physiotherapy',
          image: '/default-avatar.svg',
          availability: generateAvailability(60)
        },
        {
          id: 'trainer-4',
          name: 'Emma Garcia',
          specialization: 'Cardio & HIIT',
          image: '/default-avatar.svg',
          availability: generateAvailability(60)
        }
      ];

      // Generate mock appointments
      const mockAppointments: Appointment[] = [];
      
      // Past appointments (completed and cancelled)
      for (let i = 1; i <= 10; i++) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - (i * 2));
        const dateStr = pastDate.toISOString().split('T')[0];
        
        mockAppointments.push({
          id: `past-appointment-${i}`,
          trainerId: mockTrainers[i % mockTrainers.length].id,
          clientId: session?.user?.id || 'client-1',
          sessionType: sessionTypes[i % sessionTypes.length].id,
          date: dateStr,
          time: `${10 + i % 8}:00`,
          duration: sessionTypes[i % sessionTypes.length].duration,
          status: i % 5 === 0 ? 'cancelled' : 'completed',
          notes: i % 3 === 0 ? 'Need to focus on improving form' : undefined,
          feedback: i % 5 !== 0 ? 'Great progress! Keep up the good work.' : undefined,
          createdAt: new Date(pastDate.getTime() - 86400000 * 7).toISOString()
        });
      }

      // Upcoming appointments
      for (let i = 1; i <= 8; i++) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i * 3);
        const dateStr = futureDate.toISOString().split('T')[0];
        
        mockAppointments.push({
          id: `upcoming-appointment-${i}`,
          trainerId: mockTrainers[i % mockTrainers.length].id,
          clientId: session?.user?.id || 'client-1',
          sessionType: sessionTypes[i % sessionTypes.length].id,
          date: dateStr,
          time: `${10 + i % 8}:00`,
          duration: sessionTypes[i % sessionTypes.length].duration,
          status: i % 7 === 0 ? 'requested' : 'upcoming',
          notes: i % 4 === 0 ? 'Will need help with advanced exercises' : undefined,
          createdAt: new Date(futureDate.getTime() - 86400000 * 3).toISOString()
        });
      }

      // Set the data
      setTrainers(mockTrainers);
      setAppointments(mockAppointments);
      setIsLoading(false);
    };

    // Generate availability for trainers
    const generateAvailability = (days: number): { [date: string]: string[] } => {
      const availability: { [date: string]: string[] } = {};
      const startDate = new Date();
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date();
        currentDate.setDate(startDate.getDate() + i);
        
        // Skip weekends for some trainers (random)
        if ((currentDate.getDay() === 0 || currentDate.getDay() === 6) && Math.random() > 0.5) {
          continue;
        }
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const slots: string[] = [];
        
        // Generate time slots from 8 AM to 6 PM
        for (let hour = 8; hour < 18; hour++) {
          // Randomly skip some hours to simulate booked slots
          if (Math.random() > 0.3) {
            slots.push(`${hour}:00`);
          }
          
          // Add half-hour slots
          if (Math.random() > 0.3) {
            slots.push(`${hour}:30`);
          }
        }
        
        availability[dateStr] = slots;
      }
      
      return availability;
    };

    loadMockData();
  }, [session?.user?.id]);

  // Update available time slots when the trainer or date changes
  useEffect(() => {
    const { trainerId, date } = bookingForm;
    
    if (trainerId && date) {
      const selectedTrainer = trainers.find(trainer => trainer.id === trainerId);
      if (selectedTrainer && selectedTrainer.availability && selectedTrainer.availability[date]) {
        setAvailableTimeSlots(selectedTrainer.availability[date]);
      } else {
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  }, [bookingForm.trainerId, bookingForm.date, trainers]);

  // Handle form input changes
  const handleInputChange = (field: keyof typeof bookingForm, value: string) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value,
      // Reset time when date or trainer changes if the field is date or trainerId
      ...(field === 'date' || field === 'trainerId' ? { time: '' } : {})
    }));
  };

  // Handle booking form submission
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!bookingForm.trainerId || !bookingForm.sessionType || !bookingForm.date || !bookingForm.time) {
      setMessage({ type: 'error', text: 'Please fill out all required fields' });
      return;
    }
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      trainerId: bookingForm.trainerId,
      clientId: session?.user?.id || 'unknown',
      sessionType: bookingForm.sessionType,
      date: bookingForm.date,
      time: bookingForm.time,
      duration: sessionTypes.find(s => s.id === bookingForm.sessionType)?.duration || 60,
      status: 'requested',
      notes: bookingForm.notes,
      createdAt: new Date().toISOString()
    };
    
    // Add to appointments state
    setAppointments(prev => [...prev, newAppointment]);
    
    // Show success message
    setMessage({ type: 'success', text: 'Appointment request has been submitted!' });
    
    // Reset form
    setBookingForm({
      trainerId: '',
      sessionType: 'personal-training',
      date: '',
      time: '',
      notes: ''
    });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId: string) => {
    // Update appointment status to cancelled
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId
        ? { ...appointment, status: 'cancelled' }
        : appointment
    ));
    
    setMessage({ type: 'success', text: 'Appointment has been cancelled' });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  // For trainers: handle updating appointment status
  const handleUpdateAppointmentStatus = (appointmentId: string, status: AppointmentStatus, feedback?: string) => {
    if (!isTrainer()) return;
    
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId
        ? { ...appointment, status, feedback }
        : appointment
    ));
    
    setMessage({ 
      type: 'success', 
      text: `Appointment ${status === 'completed' ? 'marked as complete' : 
            status === 'cancelled' ? 'cancelled' : 'approved'}` 
    });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  // Filter appointments based on active tab and user role
  const getFilteredAppointments = (): Appointment[] => {
    const today = getCurrentDateString();
    const userId = session?.user?.id || '';
    
    // If user is trainer, show all appointments assigned to them
    const userAppointments = isTrainer()
      ? appointments.filter(a => a.trainerId === userId)
      : appointments.filter(a => a.clientId === userId);
    
    switch (activeTab) {
      case 'upcoming':
        return userAppointments.filter(a => 
          (a.date > today || (a.date === today && a.time > new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))) && 
          (a.status === 'upcoming' || a.status === 'requested')
        );
      case 'past':
        return userAppointments.filter(a => 
          (a.date < today || (a.date === today && a.time < new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))) || 
          a.status === 'completed' || a.status === 'cancelled'
        );
      case 'all':
        return userAppointments;
      default:
        return [];
    }
  };

  // Return loading state if data is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      
      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'book' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('book')}
        >
          Book Appointment
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
      </div>
      
      {/* Booking Form */}
      {activeTab === 'book' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Book New Appointment</h2>
          </div>
          
          <form onSubmit={handleBookAppointment} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Session Type */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Session Type</label>
                <select 
                  value={bookingForm.sessionType}
                  onChange={(e) => handleInputChange('sessionType', e.target.value as SessionType)}
                  className="w-full p-3 border rounded-md"
                  required
                >
                  {sessionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name} ({type.duration} min)</option>
                  ))}
                </select>
              </div>
              
              {/* Trainer */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Select Trainer</label>
                <select 
                  value={bookingForm.trainerId}
                  onChange={(e) => handleInputChange('trainerId', e.target.value)}
                  className="w-full p-3 border rounded-md"
                  required
                >
                  <option value="">Select a trainer</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>{trainer.name} - {trainer.specialization}</option>
                  ))}
                </select>
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date</label>
                <input 
                  type="date" 
                  value={bookingForm.date}
                  min={getCurrentDateString()}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              
              {/* Time */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Time</label>
                <select 
                  value={bookingForm.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full p-3 border rounded-md"
                  disabled={!availableTimeSlots.length}
                  required
                >
                  <option value="">Select a time</option>
                  {availableTimeSlots.map(time => (
                    <option key={time} value={time}>{formatTimeOnly(time)}</option>
                  ))}
                </select>
                {!availableTimeSlots.length && bookingForm.date && bookingForm.trainerId && (
                  <p className="text-red-500 text-sm mt-1">No available time slots for this date</p>
                )}
              </div>
              
              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Notes (Optional)</label>
                <textarea 
                  value={bookingForm.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full p-3 border rounded-md h-24"
                  placeholder="Any specific requirements or questions for the trainer..."
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Request Appointment
            </button>
          </form>
        </div>
      )}
      
      {/* Appointments List */}
      {(activeTab === 'upcoming' || activeTab === 'past' || activeTab === 'all') && (
        <div className="space-y-6">
          {getFilteredAppointments().length > 0 ? (
            getFilteredAppointments().map(appointment => {
              // Find trainer and session type info
              const trainer = trainers.find(t => t.id === appointment.trainerId);
              const sessionTypeInfo = sessionTypes.find(s => s.id === appointment.sessionType);
              
              return (
                <div key={appointment.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{sessionTypeInfo?.name}</h3>
                        <p className="text-gray-600">with {trainer?.name} ({trainer?.specialization})</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                        ${appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                      >
                        {appointment.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{formatTimeOnly(appointment.time)} ({appointment.duration} min)</span>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}
                    
                    {appointment.feedback && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium mb-1 text-blue-700">Trainer Feedback:</p>
                        <p className="text-sm text-blue-700">{appointment.feedback}</p>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                      {/* Client actions */}
                      {!isTrainer() && appointment.status === 'upcoming' && (
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                        >
                          Cancel Appointment
                        </button>
                      )}
                      
                      {/* Trainer actions */}
                      {isTrainer() && appointment.status === 'requested' && (
                        <>
                          <button 
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'upcoming')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      
                      {isTrainer() && appointment.status === 'upcoming' && (
                        <button 
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed', 'Session completed successfully. Great progress!')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">No appointments found.</p>
              {activeTab !== 'book' && (
                <button 
                  onClick={() => setActiveTab('book')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Book an Appointment
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 