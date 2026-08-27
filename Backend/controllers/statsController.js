const Car = require('../models/Car');
const BookingDetails = require('../models/BookingDetails');
const User = require('../models/User');

// Get overall dashboard statistics and metrics
exports.getDashboardStats = async (req, res) => {
  try {
    const [cars, bookings, users] = await Promise.all([
      Car.find(),
      BookingDetails.find(),
      User.find().select('-password')
    ]);

    const totalCars = cars.length;
    const availableCars = cars.filter(c => c.available).length;
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => ['Active', 'Confirmed'].includes(b.status)).length;
    
    // Revenue calculated from confirmed/paid bookings
    const totalRevenue = bookings
      .filter(b => b.status !== 'Cancelled' && (b.paymentStatus === 'paid' || b.paymentStatus === 'Paid' || b.status === 'Confirmed' || b.status === 'Active' || b.status === 'Completed'))
      .reduce((sum, b) => sum + (b.totalCost || 0), 0);
    const totalUsers = users.length;

    // Payment status breakdown
    const paidBookings = bookings.filter(b => b.paymentStatus === 'paid' || b.paymentStatus === 'Paid').length;
    const pendingPaymentBookings = bookings.filter(b => b.paymentStatus === 'pending' || b.paymentStatus === 'Pending').length;
    const failedPaymentBookings = bookings.filter(b => b.paymentStatus === 'failed' || b.paymentStatus === 'Failed').length;

    // Monthly revenue aggregation
    const monthlyMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize current year months
    for (let i = 0; i < 12; i++) {
      monthlyMap[`${months[i]}`] = 0;
    }

    bookings.forEach(b => {
      if (b.status !== 'Cancelled' && (b.paymentStatus === 'paid' || b.paymentStatus === 'Paid' || b.status === 'Confirmed' || b.status === 'Active' || b.status === 'Completed')) {
        const d = new Date(b.paidAt || b.createdAt || b.pickupDate || b.date);
        if (!isNaN(d.getTime())) {
          const monthName = months[d.getMonth()];
          monthlyMap[monthName] = (monthlyMap[monthName] || 0) + (b.totalCost || 0);
        }
      }
    });

    const monthlyRevenue = Object.entries(monthlyMap).map(([month, total]) => ({
      month,
      revenue: total,
      total
    }));

    // Status breakdown
    const statusMap = {
      Confirmed: 0,
      Active: 0,
      Completed: 0,
      Pending: 0,
      Cancelled: 0
    };
    bookings.forEach(b => {
      const s = b.status || 'Pending';
      statusMap[s] = (statusMap[s] || 0) + 1;
    });

    const bookingStatusData = Object.entries(statusMap)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));

    // Fleet Availability Breakdown
    const carAvailabilityData = [
      { name: 'Available', value: availableCars },
      { name: 'Rented / In Maintenance', value: Math.max(0, totalCars - availableCars) }
    ];

    // Category breakdown
    const categoryMap = {};
    cars.forEach(c => {
      const cat = c.category || 'Sedan';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryData = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count
    }));

    // Recent 5 bookings
    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5);

    // Recent 5 users
    const recentUsers = [...users]
      .sort((a, b) => new Date(a.createdAt ? a.createdAt : 0) - new Date(b.createdAt ? b.createdAt : 0))
      .slice(0, 5);

    res.status(200).json({
      stats: {
        totalCars,
        availableCars,
        totalBookings,
        activeBookings,
        totalRevenue,
        totalUsers,
        paidBookings,
        pendingPaymentBookings,
        failedPaymentBookings
      },
      monthlyRevenue,
      bookingStatusData,
      carAvailabilityData,
      categoryData,
      recentBookings,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to retrieve analytics', error: error.message });
  }
};
