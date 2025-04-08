import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  image: string
  category: string
  price: number
  discountPrice?: number
  status: 'available' | 'unavailable' | 'coming_soon'
  ingredients?: string[]
  preparationTime?: number
  calories?: number
  isBestSeller?: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: {
    type: String,
    required: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['coffee', 'tea', 'smoothie', 'food', 'dessert']
  },
  price: { 
    type: Number, 
    required: true 
  },
  discountPrice: { 
    type: Number 
  },
  status: { 
    type: String, 
    enum: ['available', 'unavailable', 'coming_soon'],
    default: 'available'
  },
  ingredients: [String],
  preparationTime: Number, // thời gian chuẩn bị (phút)
  calories: Number,
  isBestSeller: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
})

export default mongoose.model<IProduct>('Product', productSchema) 