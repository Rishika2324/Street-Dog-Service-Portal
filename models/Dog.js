const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    size: { type: String, required: true }, // e.g., Small, Medium, Large
    color: { type: String },
    vaccinated: { type: Boolean, default: false },
    adoptionStatus: { type: String, enum: ['Available', 'Adopted', 'Fostered'], default: 'Available' },
    location: { type: String },
    imageUrl: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dog', dogSchema);
