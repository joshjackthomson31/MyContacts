const express = require('express');
const router = express.Router();
const {
    getContacts, 
    getTrash,
    getContact, 
    createContact, 
    updateContact, 
    toggleFavorite,
    deleteContact,
    restoreContact,
    permanentDelete
} = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

// Get all contacts (with optional search & sort)
router.get("/", getContacts);

// Get trash (deleted contacts)
router.get("/trash", getTrash);

// Get single contact
router.get("/:id", getContact);

// Create new contact
router.post("/", createContact);

// Update contact
router.put("/:id", updateContact);

// Toggle favorite
router.put("/:id/favorite", toggleFavorite);

// Restore from trash
router.put("/:id/restore", restoreContact);

// Soft delete (move to trash)
router.delete("/:id", deleteContact);

// Permanent delete
router.delete("/:id/permanent", permanentDelete);

module.exports = router;