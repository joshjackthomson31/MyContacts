const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModels");

//@desc Get all contacts (excluding deleted)
//@route GET /api/contacts
//@query search - filter by name, email, or phone
//@query sort - sort by 'name' or 'date' (default: date)
//@access Private
const getContacts = asyncHandler(async (req, res) => {
    const { search, sort } = req.query;
    
    // Build query - exclude deleted contacts
    // Using $ne: true to include existing contacts that don't have isDeleted field yet
    let query = { user_id: req.user.id, isDeleted: { $ne: true } };
    
    // Add search filter if provided
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ];
    }
    
    // Build sort option
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'name') {
        sortOption = { name: 1 }; // alphabetical A-Z
    } else if (sort === 'name-desc') {
        sortOption = { name: -1 }; // alphabetical Z-A
    } else if (sort === 'date-asc') {
        sortOption = { createdAt: 1 }; // oldest first
    }
    
    const contacts = await Contact.find(query).sort(sortOption);
    res.status(200).json(contacts);
});

//@desc Get trash (deleted contacts)
//@route GET /api/contacts/trash
//@access Private
const getTrash = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ 
        user_id: req.user.id, 
        isDeleted: true 
    }).sort({ deletedAt: -1 });
    res.status(200).json(contacts);
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access Private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error(`Contact with ID ${req.params.id} not found`);
  }
  res.status(200).json(contact);
});

//@desc Create a new contact
//@route POST /api/contacts
//@access Private
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const contact = await Contact.create({ 
        name, 
        email, 
        phone, 
        user_id: req.user.id,
        isFavorite: false,
        isDeleted: false
    });
    res.status(201).json(contact);
});

//@desc Update a contact
//@route PUT /api/contacts/:id
//@access Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error(`Contact with ID ${req.params.id} not found`);
  }

  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update other user's contact");
  }

  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedContact);
});

//@desc Toggle favorite status
//@route PUT /api/contacts/:id/favorite
//@access Private
const toggleFavorite = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error(`Contact with ID ${req.params.id} not found`);
  }

  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to modify other user's contact");
  }

  contact.isFavorite = !contact.isFavorite;
  await contact.save();
  res.status(200).json(contact);
});

//@desc Soft delete a contact (move to trash)
//@route DELETE /api/contacts/:id
//@access Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error(`Contact with ID ${req.params.id} not found`);
  }

  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete other user's contact");
  }

  // Soft delete - mark as deleted instead of removing
  contact.isDeleted = true;
  contact.deletedAt = new Date();
  await contact.save();
  
  res.status(200).json({ message: "Contact moved to trash", contact });
});

//@desc Restore a contact from trash
//@route PUT /api/contacts/:id/restore
//@access Private
const restoreContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error(`Contact with ID ${req.params.id} not found`);
  }

  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to restore other user's contact");
  }

  if (!contact.isDeleted) {
    res.status(400);
    throw new Error("Contact is not in trash");
  }

  contact.isDeleted = false;
  contact.deletedAt = null;
  await contact.save();
  
  res.status(200).json({ message: "Contact restored", contact });
});

//@desc Permanently delete a contact
//@route DELETE /api/contacts/:id/permanent
//@access Private
const permanentDelete = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error(`Contact with ID ${req.params.id} not found`);
  }

  if(contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete other user's contact");
  }

  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Contact permanently deleted", contact });
});

module.exports = {
  getContacts,
  getTrash,
  getContact,
  createContact,
  updateContact,
  toggleFavorite,
  deleteContact,
  restoreContact,
  permanentDelete,
}; 