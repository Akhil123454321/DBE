import { Router } from "express";
import {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
  searchDb,
  renderSearchPage,
} from "../controllers/notes.controller";
import { renderSecurityPage } from "../controllers/users.controller";
import { isAuthenticated} from "../helpers/auth";

const router = Router();

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);

router.post("/notes/new-note", isAuthenticated, createNewNote);

// Get All Notes
router.get("/notes", isAuthenticated, renderNotes);

// Edit Notes
router.get("/notes/edit/:id", isAuthenticated, renderEditForm);

router.put("/notes/edit-note/:id", isAuthenticated, updateNote);

// Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);

//Search Notes
router.get("/notes/search", isAuthenticated, renderSearchPage);

router.post("/notes/search", isAuthenticated, searchDb);

export default router;
