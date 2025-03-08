const airportSchema = new mongoose.Schema({
    iataCode: { type: String, required: true, unique: true }, // Example: "JFK"
    name: { type: String, required: true }, // Example: "John F. Kennedy International Airport"
    city: { type: String, required: true }, // Example: "New York"
    country: { type: String, required: true }, // Example: "USA"
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });