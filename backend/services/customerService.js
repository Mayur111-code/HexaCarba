const Customer = require('../models/Customer');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildPaginationMeta, buildSearchFilter } = require('../utils/helpers');

const createCustomer = async (data) => {
  const existing = await Customer.findOne({ email: data.email });
  if (existing) throw ApiError.conflict('A customer with this email already exists');
  return Customer.create(data);
};

const getCustomers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.search) {
    Object.assign(
      filter,
      buildSearchFilter(['companyName', 'contactPerson', 'email', 'phone', 'industry'], query.search)
    );
  }
  if (query.status) filter.status = query.status;
  if (query.city) filter['address.city'] = query.city;
  if (query.state) filter['address.state'] = query.state;
  if (query.industry) filter.industry = query.industry;

  const sort = query.sort || '-createdAt';

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Customer.countDocuments(filter),
  ]);

  return {
    data: customers,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

const getCustomer = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};

const updateCustomer = async (id, data) => {
  if (data.email) {
    const existing = await Customer.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) throw ApiError.conflict('A customer with this email already exists');
  }
  const customer = await Customer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};

const deleteCustomer = async (id) => {
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};

module.exports = { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer };
