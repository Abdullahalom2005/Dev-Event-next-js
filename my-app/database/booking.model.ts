import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // Email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for optimized event queries
bookingSchema.index({ eventId: 1 });

// Pre-save hook: validate that referenced event exists
bookingSchema.pre('save', async function (next) {
  if (this.isModified('eventId')) {
    try {
      // Dynamic import to avoid circular dependency issues
      const Event = mongoose.model('Event');
      const eventExists = await Event.exists({ _id: this.eventId });
      
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(new Error('Event validation failed'));
    }
  }
  
  next();
});

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
