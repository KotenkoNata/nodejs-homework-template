const express = require('express');
const router = express.Router();
const Controllers = require('../../../controllers/contacts-controllers');
const guard = require('../../../helpers/guard');

const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateFavorite,
  validateMondoId,
} = require('./validation');

router
  .get('/', guard, Controllers.getAllContacts)
  .post(
    '/',
    guard,
    validateMondoId,
    validationCreateContact,
    Controllers.createContact,
  );

router
  .get('/:contactId', guard, validateMondoId, Controllers.getContactById)
  .delete('/:contactId', guard, validateMondoId, Controllers.removeContact)
  .put(
    '/:contactId',
    guard,
    validateMondoId,
    validationUpdateContact,
    Controllers.updateContact,
  );

router.patch(
  '/:contactId/favorite',
  guard,
  validationUpdateFavorite,
  validateMondoId,
  Controllers.updateStatusContact,
);

module.exports = router;
