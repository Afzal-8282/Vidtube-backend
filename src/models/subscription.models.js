import mongoose, { model, Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // One who is subscribing
        ref: "User",
    },
    channel: {
        type: Schema.Types.ObjectId, // One whom we are subscribing
        ref: "User"
    }
}, { timestamps: true });

export const Subscription = model("Subscription", subscriptionSchema);
