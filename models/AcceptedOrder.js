import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  
});

const AcceptedOrderSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  restaurantId: String,
  items: [ItemSchema],
  totalCount: Number,
  totalPrice: Number,
  orderDate: Date,
  status: String,
  rejectedBy: {
    type: [String], // deliveryBoy IDs
    default: [],
  },
  rest : String
});

export default mongoose.models.AcceptedOrder ||
  mongoose.model("AcceptedOrder", AcceptedOrderSchema);
