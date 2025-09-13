const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);