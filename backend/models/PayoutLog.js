const mongoose = require('mongoose');

const payoutLogSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        index: true
    },
    technicianId: {
        type: String,
        required: true,
        default: 'partner-default-1',
        index: true
    },
    technicianUpi: {
        type: String,
        required: true,
        trim: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    laborCharge: {
        type: Number,
        required: true
    },
    materialsCharge: {
        type: Number,
        default: 0
    },
    technicianShare: {
        type: Number,
        required: true
    },
    platformShare: {
        type: Number,
        required: true
    },
    splitRatio: {
        type: String,
        default: '85/15'
    },
    utr: {
        type: String,
        required: true,
        unique: true
    },
    gateway: {
        type: String,
        default: 'Razorpay Route (Instant IMPS/UPI)'
    },
    status: {
        type: String,
        enum: ['settled', 'processing', 'failed'],
        default: 'settled'
    },
    idempotencyKey: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('PayoutLog', payoutLogSchema);
