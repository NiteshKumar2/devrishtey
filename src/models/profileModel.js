import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linked user ID
    relationLookingFor: { type: String, enum: ['self', 'sibling', 'relative'] }, // Relation looking for
    birthTime: { type: String }, // Time of birth (HH:mm format or string)
    education: { type: String}, // Highest education qualification
    annualSalary: { type: String }, // Salary (e.g., "10-12 LPA")
    partnerPreferences: { type: String }, // Preference for partner
    maritalStatus: {
      type: String,
      enum: ['single', 'divorced', 'widowed'],
    }, // Marital status
    fatherName: { type: String }, // Father's name
    fatherOccupation: { type: String }, // Father's job or profession
    avoidGotra: {type: String }, // Avoid same Gotra
    birthAddress: { type: String }, // Place of birth
    profileImage: { type: String }, // Profile picture URL
    dietaryPreference: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan', 'eggetarian'],
    }, // Diet type
    siblings: { type: Number, default: 0 }, // Number of siblings
    hobbies: { type: [String] }, // List of hobbies
    propertyDetails: { type: String }, // Description of property/land ownership
    whatsappNumber: { type: String }, // WhatsApp contact
    livingWithFamily: { type: Boolean, default: true }, // Whether living with family
    bloodGroup: { type: String }, // Blood group
    bio: { type: String }, // Brief bio or introduction
    createdAt: { type: Date, default: Date.now }, // Profile creation timestamp
    updatedAt: { type: Date, default: Date.now }, // Last update timestamp
  });
  
  export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
  