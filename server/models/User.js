const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'MEMBER'], default: 'MEMBER' },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);