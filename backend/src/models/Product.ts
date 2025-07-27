import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  stock: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [3, 'Name must be at least 3 characters'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
 
}, {
    timestamps: true,
  });

export const Product = model<IProduct>('Product', productSchema);
