const contactService = require('../services/contactService');
const ApiResponse = require('../utils/ApiResponse');

const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.body);
    ApiResponse.success(res, contact, 'Your message has been submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const result = await contactService.getContacts(req.query);
    ApiResponse.paginated(res, result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await contactService.getContact(req.params.id);
    ApiResponse.success(res, contact);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const contact = await contactService.markAsRead(req.params.id);
    ApiResponse.success(res, contact, 'Contact marked as read');
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await contactService.updateContact(req.params.id, req.body);
    ApiResponse.success(res, contact, 'Contact updated');
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    await contactService.deleteContact(req.params.id);
    ApiResponse.success(res, null, 'Contact deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact, getContacts, getContact, markAsRead, updateContact, deleteContact };
