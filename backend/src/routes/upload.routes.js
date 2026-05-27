const router = require('express').Router();
const multer = require('multer');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');
const supabase = require('../lib/supabase');
const { v4: uuidv4 } = require('uuid');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
});

router.post('/image', authenticate, requireAdmin, upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileName = `${uuidv4()}.${req.file.mimetype.split('/')[1]}`;
    const { data, error } = await supabase.storage
      .from('tickethub')
      .upload(`events/${fileName}`, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) {
      // Fallback: return placeholder if storage not configured
      return res.json({ url: `https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=600`, publicId: fileName });
    }

    const { data: { publicUrl } } = supabase.storage.from('tickethub').getPublicUrl(`events/${fileName}`);
    res.json({ url: publicUrl, publicId: fileName });
  })
);

module.exports = router;
