const airlineSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Example: "DL" for Delta Airlines
    name: { type: String, required: true }, // Example: "Delta Airlines"
    logoUrl: { type: String, default: '' }, // URL to the airline's logo
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });