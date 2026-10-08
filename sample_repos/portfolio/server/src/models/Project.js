const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  bulletPoints: [{ type: String }],
  techStack: [{ type: String }],
  liveLink: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  category: { type: String, default: 'Full Stack', trim: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
