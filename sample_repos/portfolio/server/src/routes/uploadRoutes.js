const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Ensure local uploads directories exist
const uploadsDir = path.join(__dirname, '../../uploads');
const clientPublicUploadsDir = path.join(__dirname, '../../../client/public/uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(clientPublicUploadsDir)) fs.mkdirSync(clientPublicUploadsDir, { recursive: true });
} catch (e) {
  console.warn('Could not initialize local upload folders:', e.message);
}

// @desc    Upload image or resume file
// @route   POST /api/v1/upload
// @access  Private (Admin)
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  // Determine resource type: use 'auto' so Cloudinary detects images and documents
  const isPdf = req.file.mimetype === 'application/pdf';
  const cleanOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const safeFileName = `${Date.now()}-${cleanOriginalName}`;

  // Always persist locally in server/uploads so the file is guaranteed to be available
  let localFileUrl = null;
  try {
    const targetPath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(targetPath, req.file.buffer);
    localFileUrl = `/uploads/${safeFileName}`;
    
    // Also save to client/public/uploads if it exists
    if (fs.existsSync(clientPublicUploadsDir)) {
      const clientPath = path.join(clientPublicUploadsDir, safeFileName);
      fs.writeFileSync(clientPath, req.file.buffer);
    }
  } catch (fsErr) {
    console.warn('Could not save local copy:', fsErr.message);
  }

  // If Cloudinary credentials are not configured, return the local file URL directly
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    if (localFileUrl) {
      return res.status(200).json({
        url: localFileUrl,
        public_id: safeFileName,
        bytes: req.file.size
      });
    }
    return res.status(500).json({ message: 'Upload service not configured and local storage failed' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'anshika-portfolio',
      resource_type: 'auto',
      public_id: safeFileName
    },
    (error, result) => {
      // If Cloudinary errors out but local copy succeeded, fallback to local URL
      if (error) {
        console.warn('Cloudinary upload warning:', error.message);
        if (localFileUrl) {
          return res.status(200).json({
            url: localFileUrl,
            public_id: safeFileName,
            bytes: req.file.size
          });
        }
        return res.status(500).json({ message: 'Upload failed: ' + error.message });
      }

      // If successful, return Cloudinary URL (or local if prefered for raw PDFs)
      const finalUrl = result.secure_url || localFileUrl;

      res.status(200).json({
        url: finalUrl,
        cloudinary_url: result.secure_url,
        public_id: result.public_id,
        bytes: result.bytes,
        format: result.format
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

module.exports = router;
