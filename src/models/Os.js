import { Schema, model } from "mongoose";


const OSschema = new Schema(
  {
    id: { type: String, trim: true },
    type: { type: String, trim: true },
    version: {type: String, trim: true},
    comments: { type: String, required: true },
    created_by: {type: String, required: true},
    created_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default model("OS", OSschema);