const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true }, // Reference to Flight
    fareType: { type: String, required: true, enum: ['economy', 'business', 'first-class'] }, // Fare type
    extras: {
      baggage: { type: Boolean, default: false }, // Extra baggage
      meals: { type: Boolean, default: false }, // In-flight meals
      insurance: { type: Boolean, default: false }, // Travel insurance
    },
    seatNumber: { type: Number, required: true }, // Selected seat number
    totalPrice: { type: Number, required: true }, // Total price of the booking
    paymentStatus: { type: String, required: true, enum: ['pending', 'paid', 'cancelled'], default: 'pending' }, // Payment status
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });