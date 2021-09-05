import { Schema, model } from "mongoose";
import Mongoose from "mongoose";

const db_env_schema = new Schema(
  {
    id: { type: Mongoose.Schema.Types.ObjectId, ref: "Db"},
    app_id: { type: String, trim: true },
    comments: { type: String, required: true },
    created_by: {type: String, required: true},
    created_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default model("DB_env", db_env_schema);