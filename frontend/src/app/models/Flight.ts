const flightSchema = new mongoose.Schema({
    flightNumber: { type: String, required: true, unique: true }, // Example: "DL123"
    airline: { type: mongoose.Schema.Types.ObjectId, ref: 'Airline', required: true }, // Reference to Airline
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true }, // Reference to Airport
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Airport', required: true }, // Reference to Airport
    departure: { type: Date, required: true }, // Departure date and time
    arrival: { type: Date, required: true }, // Arrival date and time
    duration: { type: Number, required: true }, // Duration in minutes
    price: { type: Number, required: true }, // Base price of the flight
    seatsAvailable: { type: Number, required: true }, // Number of available seats
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });