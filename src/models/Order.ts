import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  gigId: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  transactionId: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;
