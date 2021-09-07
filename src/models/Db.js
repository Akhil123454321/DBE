
import { Schema, model } from "mongoose";

const DBSchema = new Schema(
  {
    db_id: { type: String, trim: true, unique:true},
    db_env: {type: String, trim: true},
    Mon_yr_added: {type: Date, default: Date.now,  trim: true },
    RFI_RFC : {type: String, trim:true},
    company: {type: String, trim: true},
    business_line: {type: String, trim: true},
    host_name: {type: String, trim: true},
    os_id: { type: String, trim: true},
    dbms_type: {type: String, trim: true},
    db_port: {type: Number},
    cluster_id: {type: String, trim: true},
    dba_support_team: {type: String, trim: true},
    created_by: {type: String, trim: true},
    created_date: {type: Date, default: Date.now},
    updated_date: {type: Date, default: Date.now},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("DB", DBSchema);


