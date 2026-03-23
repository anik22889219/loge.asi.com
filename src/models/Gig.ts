import mongoose, { Schema, model, models } from 'mongoose';

const GigSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Web Development', 'Graphic Design', 'Digital Marketing'] },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Gig = models.Gig || model('Gig', GigSchema);
export default Gig;
