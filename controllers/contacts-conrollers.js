const Contacts = require('../repositories/contacts-methods');

const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contacts.listContacts();
    res.json({ status: 'success', code: 200, data: { result } });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' });
  } catch (e) {
    next(e);
  }
};

const createContact = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'New contact was created successfully',
      data: { contact },
    });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'success',
        message: 'Contact was deleted successfully',
        code: 200,
        data: { contact },
      });
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );
    if (contact) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Contact was updated successfully',
        data: { contact },
      });
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' });
  } catch (e) {
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const updatedFavorite = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );

    if (!updatedFavorite) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found.' });
    }

    return res.json({
      status: 'success',
      code: 200,
      message: 'Contact updated.',
      payload: updatedFavorite,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
