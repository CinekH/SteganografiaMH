import mongoose from 'mongoose'

const imageSchema = mongoose.Schema({
    thumbnail: { type: String, required: true },
    fullImage: { type: String, required: true },
    userId: { type: String, required: true },
    id: { type: String },
});

export default mongoose.model("Image", imageSchema);