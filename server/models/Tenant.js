const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TenantSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['FREE', 'PRO'], default: 'FREE' },
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);