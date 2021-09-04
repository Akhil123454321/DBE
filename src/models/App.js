import { Schema, model } from "mongoose";


const AppSchema = new Schema(
  {
    id: { type: String, trim: true },
    name: {type: String, trim:true},
    support_metal: {type:String, trim:true},
    ai_hsi: {type:String, trim:true},
    so_name: {type: String, trim:true},
    comments: { type: String },
    created_by: {type: String, trim:true},
    created_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default model("App", AppSchema);