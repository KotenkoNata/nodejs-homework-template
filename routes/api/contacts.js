const express = require('express');
const router = express.Router();
const Controllers = require('../../controllers/contacts-conrollers');

const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateFavorite,
  validateMondoId,
} = require('./validation');

router
  .get('/', Controllers.getAllContacts)
  .post(
    '/',
    validateMondoId,
    validationCreateContact,
    Controllers.createContact,
  );

router
  .get('/:contactId', validateMondoId, Controllers.getContactById)
  .delete('/:contactId', validateMondoId, Controllers.removeContact)
  .put(
    '/:contactId',
    validateMondoId,
    validationUpdateContact,
    Controllers.updateContact,
  );

router.patch(
  '/:contactId/favorite',
  validationUpdateFavorite,
  validateMondoId,
  Controllers.updateStatusContact,
);

module.exports = router;
