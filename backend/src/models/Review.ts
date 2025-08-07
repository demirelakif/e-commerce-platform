import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  isVerified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Review title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
      min: [0, "Helpful count cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate reviews
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product average rating when review is saved/updated
reviewSchema.post("save", async function (doc) {
  const Product = mongoose.model("Product");
  const product = await Product.findById(doc.product);

  if (product) {
    const reviews = await mongoose.model("Review").find({
      product: doc.product,
      isApproved: true,
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Product.findByIdAndUpdate(doc.product, {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    });
  }
});

// Update product average rating when review is deleted
reviewSchema.post("deleteOne", async function (doc) {
  const Product = mongoose.model("Product");
  const product = await Product.findById(doc.product);

  if (product) {
    const reviews = await mongoose.model("Review").find({
      product: doc.product,
      isApproved: true,
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Product.findByIdAndUpdate(doc.product, {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    });
  }
});

export default mongoose.model<IReview>("Review", reviewSchema);
