import DB from "../models/Db";
import Note from "../models/Note";

export const renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};


export const createNewNote = async (req, res) => {
  const {db_id, db_env, Mon_yr_added, RFI_RFC, company, business_line, host_name, os_id, dbms_type, db_port, cluster_id, dba_support_team, created_by, craeted_date} = req.body;
  const updated_date = Date.now();
  const errors = [];
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description,
    });
  } else {
    const newDB = new DB({ db_id, db_env, Mon_yr_added, RFI_RFC, company, business_line, host_name, os_id, dbms_type, db_port, cluster_id, dba_support_team, created_by, craeted_date, updated_date});  
    await newDB.save();
    req.flash("success_msg", "DB Added Successfully");
    res.redirect("/notes");
  }
};

export const renderNotes = async (req, res) => {

  const dbs = await DB.find()
    .sort({ date: "desc" })
    .lean();

  res.render("notes/all-notes", { dbs });
};


export const renderEditForm = async (id, res) => {
  const db = await DB.findById(id).lean();
  res.render("notes/edit-note", { db });
};

export const updateNote = async (req, res) => {
  const { id, env, mon_yr_added, RFI_RFC, company, lob, host, os_id, dbms_type, port, cluster_id, dba_support_team, created_by, craeted_date } = req.body;
  await DB.findByIdAndUpdate(req.params.id, { id, env, mon_yr_added, RFI_RFC, company, lob, host, os_id, dbms_type, port, cluster_id, dba_support_team, created_by, craeted_date });
  req.flash("success_msg", "DB Updated Successfully");
  res.redirect("/");
};


export const deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};

export const renderSearchPage = (req, res)=> res.render("notes/search-db");

export const searchDb = async (req, res) =>{
  const db_id = req.body;
  const db_dets = await DB.find({db_id : db_id})
  res.render("notes/search-db", {db_dets})
}