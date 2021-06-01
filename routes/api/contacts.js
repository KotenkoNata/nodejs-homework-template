const express = require('express');
const router = express.Router();
const Contacts = require('../../model/index');
const {
  validationCreateContact,
  validationUpdateContact,
} = require('./validation');

router.get('/', async (req, res, next) => {
  try {
    const result = await Contacts.listContacts();
    res.json({ status: 'success', code: 200, data: { result } });
  } catch (e) {
    next(e);
  }
});

router.get('/:contactId', async (req, res, next) => {
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
});

router.post('/', validationCreateContact, async (req, res, next) => {
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
});

router.delete('/:contactId', async (req, res, next) => {
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
});

router.put('/:contactId', validationUpdateContact, async (req, res, next) => {
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
});

module.exports = router;
