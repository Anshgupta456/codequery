const Profile = require('../models/Profile');

// @desc    Get profile details
// @route   GET /api/v1/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create initial profile document if none exists
      profile = await Profile.create({
        name: 'Anshika Gupta',
        title: 'Software Engineer',
        email: 'anshikagupta.work@gmail.com',
        headline: 'I build modern web applications with a focus on clean code, great user experiences, and real impact.',
        summary: 'Software Engineer with hands-on experience developing scalable full-stack web applications, RESTful APIs, and responsive user interfaces.',
        location: 'New Delhi / Remote, India',
        github: 'https://github.com/anshikagupta',
        linkedin: 'https://linkedin.com/in/anshikagupta',
        profileImageUrl: '/anshika_bnw.png',
        colorImageUrl: '/anshika_col.png',
        resumeFileUrl: '/Anshika_Gupta_Resume.pdf'
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update profile details
// @route   PUT /api/v1/profile
// @access  Private (Admin)
const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    const updated = await profile.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
