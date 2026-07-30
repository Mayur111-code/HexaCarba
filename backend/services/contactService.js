const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta, buildSearchFilter } = require('../utils/helpers');

const createContact = async (data) => {
  return Contact.create(data);
};

const getContacts = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.search) {
    Object.assign(filter, buildSearchFilter(['name', 'email', 'subject', 'message', 'company'], query.search));
  }
  if (query.status) filter.status = query.status;

  const sort = query.sort || '-createdAt';

  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);

  return {
    data: contacts,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getContact = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) throw ApiError.notFound('Contact not found');
  return contact;
};

const updateContact = async (id, data) => {
  const contact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!contact) throw ApiError.notFound('Contact not found');
  return contact;
};

const markAsRead = async (id) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { status: 'read' },
    { new: true }
  );
  if (!contact) throw ApiError.notFound('Contact not found');
  return contact;
};

const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw ApiError.notFound('Contact not found');
  return contact;
};

module.exports = { createContact, getContacts, getContact, updateContact, markAsRead, deleteContact };
