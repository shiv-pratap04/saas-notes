require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Tenant = require('./models/Tenant');
const User = require('./models/User');

const seedData = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await Tenant.deleteMany({});
  await User.deleteMany({});

  console.log('Seeding new data...');
  const password = await bcrypt.hash('password', 12);

  const acme = await Tenant.create({ name: 'Acme', slug: 'acme' });
  await User.create({ email: 'admin@acme.test', password, role: 'ADMIN', tenantId: acme._id });
  await User.create({ email: 'user@acme.test', password, role: 'MEMBER', tenantId: acme._id });
  console.log('Acme tenant and users created.');

  const globex = await Tenant.create({ name: 'Globex', slug: 'globex' });
  await User.create({ email: 'admin@globex.test', password, role: 'ADMIN', tenantId: globex._id });
  await User.create({ email: 'user@globex.test', password, role: 'MEMBER', tenantId: globex._id });
  console.log('Globex tenant and users created.');

  console.log('✅ Data seeded successfully!');
  mongoose.connection.close();
};

seedData().catch(err => {
    console.error(err);
    mongoose.connection.close();
});