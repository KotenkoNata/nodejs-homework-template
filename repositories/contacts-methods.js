const Contact = require('../model/contact-schema');

const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async contactId => {
  return await Contact.findById(contactId);
};

const removeContact = async contactId => {
  return await Contact.findOneAndRemove(contactId);
};

const addContact = async body => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findOneAndUpdate(contactId, { ...body }, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
