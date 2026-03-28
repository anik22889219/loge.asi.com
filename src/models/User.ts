import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google OAuth users
  role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
  image: { type: String, default: '' },
  
  // Verification System Fields
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Active', 'Suspended'], 
    default: 'Pending' 
  },
  agreements: {
    ageConfirmed: { type: Boolean, default: false },
    legalRightsConfirmed: { type: Boolean, default: false },
    recordKeepingConsent: { type: Boolean, default: false },
    licenseConsent: { type: Boolean, default: false },
    digitalSignature: { type: String, default: '' },
    agreedAt: { type: Date }
  },
  verificationData: {
    faceVideoUrl: { type: String, default: '' },
    idCardUrl: { type: String, default: '' },
    submittedAt: { type: Date }
  },
  lastActiveAt: { type: Date, default: Date.now },
  
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model('User', UserSchema);

export default User;
