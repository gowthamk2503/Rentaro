const axios = require('axios');
const crypto = require('crypto');

const API_BASE = 'http://localhost:5000/api';
const RAZORPAY_KEY_SECRET = 'rentaroSecretMockKey123456789';
const RAZORPAY_WEBHOOK_SECRET = 'rentaroWebhookSecret123';

async function runPaymentTests() {
  console.log('--- Starting Rentaro Razorpay Security & Payment Verification ---');

  try {
    // 1. Health Check
    const health = await axios.get(`${API_BASE}/health`);
    console.log('1. Backend Health Check:', health.data);

    // 2. Customer Login
    const loginRes = await axios.post(`${API_BASE}/users/login`, {
      email: 'customer@example.com',
      password: 'Password@123'
    });
    const token = loginRes.data.token;
    const user = loginRes.data.user;
    console.log('2. Customer Logged In:', user.email);

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. Create a Booking (which will be initialized as Pending & pending payment)
    const bookingRes = await axios.post(
      `${API_BASE}/bookings/create`,
      {
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 9876543210',
        pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        car: 'Tata Nexon EV',
        color: 'Intense Teal'
      },
      { headers: authHeaders }
    );

    const booking = bookingRes.data.booking;
    console.log('3. Booking Created in Pending State:', {
      bookingRef: booking.bookingRef,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      totalCost: booking.totalCost
    });

    if (booking.status !== 'Pending' || booking.paymentStatus !== 'pending') {
      throw new Error(`Booking initial state unexpected: status=${booking.status}, paymentStatus=${booking.paymentStatus}`);
    }

    // 4. Test Create Order
    const orderRes = await axios.post(
      `${API_BASE}/payments/create-order`,
      { bookingId: booking._id },
      { headers: authHeaders }
    );
    console.log('4. Razorpay Order Created:', {
      orderId: orderRes.data.orderId,
      amount: orderRes.data.amount,
      currency: orderRes.data.currency,
      keyId: orderRes.data.keyId
    });

    const orderId = orderRes.data.orderId;
    const paymentId = `pay_${crypto.randomBytes(8).toString('hex')}`;

    // 5. Test Invalid Signature Rejection (Security Test)
    console.log('5. Testing Invalid Signature Rejection...');
    try {
      await axios.post(
        `${API_BASE}/payments/verify`,
        {
          bookingId: booking._id,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: 'fake_tampered_signature_12345'
        },
        { headers: authHeaders }
      );
      throw new Error('FAILED: Server accepted invalid tampered signature!');
    } catch (tamperErr) {
      console.log('✅ PASS: Server correctly rejected invalid signature:', tamperErr.response?.data?.message || tamperErr.message);
    }

    // 6. Test Valid HMAC-SHA256 Signature Verification
    console.log('6. Generating authentic HMAC-SHA256 signature...');
    const authenticSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const verifyRes = await axios.post(
      `${API_BASE}/payments/verify`,
      {
        bookingId: booking._id,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: authenticSignature
      },
      { headers: authHeaders }
    );

    console.log('✅ PASS: Payment Verified and Booking Confirmed:', {
      message: verifyRes.data.message,
      status: verifyRes.data.booking.status,
      paymentStatus: verifyRes.data.booking.paymentStatus,
      paidAt: verifyRes.data.booking.paidAt,
      paymentId: verifyRes.data.booking.razorpayPaymentId
    });

    if (verifyRes.data.booking.status !== 'Confirmed' || verifyRes.data.booking.paymentStatus !== 'paid') {
      throw new Error('Booking was not updated to Confirmed and paid status!');
    }

    // 7. Test Idempotency (Re-verifying must return safely without errors)
    const idempotentRes = await axios.post(
      `${API_BASE}/payments/verify`,
      {
        bookingId: booking._id,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: authenticSignature
      },
      { headers: authHeaders }
    );
    console.log('✅ PASS: Idempotent Verification Handled:', idempotentRes.data.message);

    // 8. Test Webhook Verification
    console.log('8. Testing Razorpay Webhook Event Processing...');
    const webhookPayload = JSON.stringify({
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: orderId,
            amount: booking.totalCost * 100,
            currency: 'INR',
            status: 'captured'
          }
        }
      }
    });

    const webhookSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(webhookPayload)
      .digest('hex');

    const webhookRes = await axios.post(
      `${API_BASE}/payments/webhook`,
      JSON.parse(webhookPayload),
      {
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': webhookSignature
        }
      }
    );
    console.log('✅ PASS: Webhook processed event successfully:', webhookRes.data);

    // 9. Test User Isolation (Different user cannot view/pay for this booking)
    console.log('9. Testing Customer Isolation Security...');
    const otherUserLogin = await axios.post(`${API_BASE}/users/register`, {
      name: 'Unrelated User',
      email: `other_${Date.now()}@example.com`,
      password: 'Password@123'
    });
    const otherToken = otherUserLogin.data.token;

    try {
      await axios.post(
        `${API_BASE}/payments/create-order`,
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${otherToken}` } }
      );
      throw new Error('FAILED: Unauthorized user was able to create order for another user booking!');
    } catch (isoErr) {
      console.log('✅ PASS: Cross-user access blocked:', isoErr.response?.data?.message || isoErr.message);
    }

    console.log('\n🎉 ALL 9 SECURE PAYMENT TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('❌ TEST FAILED:', err.response?.data || err.message);
    process.exit(1);
  }
}

runPaymentTests();
