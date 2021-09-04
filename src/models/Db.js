import { Schema, model } from "mongoose";


const DBSchema = new Schema(
  {
    id: { type: String, trim: true},
    env: {type: String, trim: true},
    mon_yr_added: {type: Date, default: Date.now,  trim: true },
    RFI_RFC : {type: String, trim:true},
    company: {type: String, trim: true},
    lob: {type: String, trim: true},
    host: {type: String, trim: true},
    os_id: { type: mongoose.Schema.Types.ObjectId, ref: 'OS'},
    dbms_type: {type: String, trim: true},
    port: {type: Number},
    cluster_id: {type: mongoose.Schema.Types.ObjectId, ref:'Cluster'},
    dba_support_team: {type: String, trim: true},
    created_by: {type: String, trim: true},
    created_date: {type: Date, default: Date.now}

  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default model("DB", DBSchema);