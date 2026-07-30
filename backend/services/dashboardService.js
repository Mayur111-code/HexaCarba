const Employee = require('../models/Employee');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Contact = require('../models/Contact');
const Salary = require('../models/Salary');

const getDashboardStats = async () => {
  const [
    totalEmployees,
    activeEmployees,
    totalCategories,
    activeCategories,
    totalProducts,
    activeProducts,
    totalCustomers,
    totalContacts,
    unreadContacts,
    salaryStats,
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'active' }),
    Category.countDocuments(),
    Category.countDocuments({ isActive: true }),
    Product.countDocuments(),
    Product.countDocuments({ status: 'active' }),
    Customer.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'unread' }),
    Salary.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$netSalary', 0] },
          },
          totalPending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$netSalary', 0] },
          },
          avgNetSalary: { $avg: '$netSalary' },
        },
      },
    ]),
  ]);

  return {
    employees: { total: totalEmployees, active: activeEmployees },
    categories: { total: totalCategories, active: activeCategories },
    products: { total: totalProducts, active: activeProducts },
    customers: { total: totalCustomers },
    contacts: { total: totalContacts, unread: unreadContacts },
    salary: salaryStats[0] || { totalPaid: 0, totalPending: 0, avgNetSalary: 0 },
  };
};

const getRecentActivity = async () => {
  const [recentEmployees, recentProducts, recentCustomers, recentContacts] = await Promise.all([
    Employee.find().sort('-createdAt').limit(5).select('firstName lastName employeeId designation createdAt').lean(),
    Product.find().sort('-createdAt').limit(5).select('name slug status createdAt').populate('category', 'name').lean(),
    Customer.find().sort('-createdAt').limit(5).select('companyName contactPerson email createdAt').lean(),
    Contact.find().sort('-createdAt').limit(5).select('name email subject status createdAt').lean(),
  ]);

  return { recentEmployees, recentProducts, recentCustomers, recentContacts };
};

module.exports = { getDashboardStats, getRecentActivity };
