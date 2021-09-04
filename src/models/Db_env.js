import { Schema, model } from "mongoose";


const db_env_schema = new Schema(
  {
    id: { type: String, trim: true},
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