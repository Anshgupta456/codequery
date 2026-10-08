const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Anshika Gupta' },
  title: { type: String, required: true, default: 'Software Engineer' },
  headline: { type: String, default: '' },
  summary: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, required: true },
  location: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  leetcode: { type: String, default: '' },
  codeforces: { type: String, default: '' },
  resumeFileUrl: { type: String, default: '' },
  profileImageUrl: { type: String, default: '' },
  colorImageUrl: { type: String, default: '' },
  yearsExperience: { type: String, default: '2+' },
  projectsCompleted: { type: String, default: '12+' },
  contributions: { type: String, default: '500+' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
