import { Schema, model } from "mongoose";


const ClusterSchema = new Schema(
  {
    id: { type: String, trim: true, unique: true },
    type: { type: String, required: true, unique: true, trim: true },
    comments: { type: String, required: true },
    created_by: {type: String, required: true},
    created_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default model("Cluster", ClusterSchema);