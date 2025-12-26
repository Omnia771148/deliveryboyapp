import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    isActive: { type: Boolean, default: true },
  },
  { collection: "deliveryboyusers" } // 👈 collection name
);

export default mongoose.models.DeliveryBoyUser ||
  mongoose.model("DeliveryBoyUser", deliveryBoySchema);
