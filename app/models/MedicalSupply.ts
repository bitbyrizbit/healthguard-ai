import mongoose, { Schema, Document, Model } from 'mongoose'; 

export interface IInventory { 
  sku: string; 
  stock: number; 
  warehouseLocation: string; 
} 

export interface IMedicalSupply extends Document { 
  title: string; 
  slug: string; 
  price: number; 
  category: string; 
  tags: string[]; 
  inventory: IInventory;
  inStock: boolean; 
  createdAt: Date; 
  updatedAt: Date; 
} 

const InventorySchema = new Schema<IInventory>(
  { 
    sku: { 
      type: String, 
      required: [true, 'SKU identifier is mandatory'], 
      uppercase: true, 
      trim: true, 
    }, 
    stock: { 
      type: Number, 
      required: [true, 'Stock count is required'], 
      min: [0, 'Stock cannot be negative'], 
      default: 0, 
    }, 
    warehouseLocation: { 
      type: String, 
      required: [true, 'Warehouse location must be specified'], 
      trim: true, 
    }, 
  }, 
  { _id: false } 
); 

const MedicalSupplySchema = new Schema<IMedicalSupply>(
  { 
    title: { 
      type: String, 
      required: [true, 'Supply title is required'], 
      trim: true, 
      maxlength: [100, 'Title cannot exceed 100 characters'], 
    }, 
    slug: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: String,
      required: true,
      enum: ['PPE', 'Medication', 'Surgical', 'Diagnostics', 'Other'],
      default: 'Other'
    },
    tags: {
      type: [String],
      default: []
    },
    inventory: {
      type: InventorySchema,
      required: true
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const MedicalSupply: Model<IMedicalSupply> = mongoose.models.MedicalSupply || mongoose.model<IMedicalSupply>('MedicalSupply', MedicalSupplySchema);
