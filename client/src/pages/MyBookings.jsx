import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar, MapPin, Car, Clock, ArrowRight,
  CheckCircle, XCircle, AlertCircle, BookOpen,
  ChevronRight, Eye, Ban
} from 'lucide-react';

const statusConfig = {
  confirmed: { label: 'Confirmed', color: 'badge-success', icon: CheckCircle },
  pending: { label: 'Pending', color: 'badge-warning', icon: Clock },
  cancelled: { label: 'Cancelled', color: 'badge-error', icon: XCircle },
};

const MyBookings = () => {
  const { axios, token, user, setShowLogin, currency, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/bookings/user');
      if (data?.success && Array.isArray(data?.bookings)) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancellingId(bookingId);
    try {
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status: 'cancelled',
      });
      if (data?.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } else {
        toast.error(data?.message || 'Failed to cancel booking');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  // Not logged in
  if (!token) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center text-center section-padding">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Sign in to view bookings</h2>
        <p className="text-text-secondary mb-6">You need to be signed in to see your reservations.</p>
        <button onClick={() => setShowLogin(true)} className="btn-primary px-6 py-3 rounded-lg text-sm">
          Sign In
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 max-w-[1400px] mx-auto section-padding">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-[2px] bg-accent" />
          <span className="text-xs font-medium tracking-[0.15em] text-accent uppercase">
            My Reservations
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary font-editorial tracking-tight">
          My Bookings
        </h1>
        <p className="text-text-secondary mt-1">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5">
              <div className="flex gap-4">
                <div className="w-32 h-24 skeleton rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 skeleton" />
                  <div className="h-4 w-32 skeleton" />
                  <div className="h-4 w-64 skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const car = booking.car || {};
            const status = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const pickupDate = new Date(booking.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const returnDate = new Date(booking.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const createdDate = new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <div key={booking._id} className="bg-white rounded-xl border border-border overflow-hidden hover:border-accent/30 transition-colors">
                <div className="flex flex-col sm:flex-row">
                  {/* Car Image */}
                  <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-bg-secondary overflow-hidden">
                    <img
                      src={car.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={car.title || car.brand || 'Vehicle'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-text-primary">
                            {car.brand} {car.model || car.title}
                          </h3>
                          <p className="text-xs text-text-secondary mt-0.5">
                            Booked on {createdDate}
                          </p>
                        </div>
                        <span className={`badge ${status.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{pickupDate} → {returnDate}</span>
                        </div>
                        {car.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            <span>{car.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <div>
                        <span className="text-lg font-bold text-accent">{currency}{booking.price}</span>
                        <span className="text-xs text-text-secondary ml-1">total</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-error border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Ban className="w-3 h-3" />
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                        {car._id && (
                          <Link
                            to={`/car-details/${car._id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View Car
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No bookings yet</h3>
          <p className="text-text-secondary max-w-md mb-6">
            Start your journey by browsing our premium fleet and booking your first car.
          </p>
          <Link to="/cars" className="btn-primary px-6 py-3 rounded-lg text-sm">
            Browse Cars
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;