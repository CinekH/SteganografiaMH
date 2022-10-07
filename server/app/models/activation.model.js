import mongoose from 'mongoose'

const activationSchema = mongoose.Schema({
    id: { type: String },
    hash: { type: String, required: true },
    email: { type: String, required: true },
    expiresAt: { type: Date, expires: '7200', default: Date.now }
});

export default mongoose.model("Activation", activationSchema);