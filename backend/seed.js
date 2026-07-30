const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const config = require('./config/env');

const defaultCategories = [
  { name: 'Heat Exchanger', description: 'Graphite heat exchangers for corrosive environments', displayOrder: 1, slug: 'heat-exchanger' },
  { name: 'Graphite Equipment', description: 'Custom graphite equipment and components', displayOrder: 2, slug: 'graphite-equipment' },
  { name: 'Columns', description: 'Graphite columns for distillation and absorption', displayOrder: 3, slug: 'columns' },
  { name: 'Reactors', description: 'Graphite reactors for chemical processing', displayOrder: 4, slug: 'reactors' },
  { name: 'PTFE Products', description: 'PTFE lined products and components', displayOrder: 5, slug: 'ptfe-products' },
  { name: 'Ejectors', description: 'Water jet ejectors and vacuum systems', displayOrder: 6, slug: 'ejectors' },
  { name: 'Condensers', description: 'Graphite shell and tube condensers', displayOrder: 7, slug: 'condensers' },
  { name: 'Acid Systems', description: 'Acid concentration and dilution systems', displayOrder: 8, slug: 'acid-systems' },
];

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: config.adminSeed.email });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: config.adminSeed.email,
        password: config.adminSeed.password,
        role: 'admin',
      });
      console.log('Admin user seeded');
    } else {
      console.log('Admin user already exists');
    }

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`Category "${cat.name}" seeded`);
      }
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
