const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// GET /api/users/search?username=ash
router.get('/search', async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username query is required' });
  }

  try {
    const users = await User.find({
      username: { $regex: '^' + username }
    })
      .limit(10)
      .select('_id username fullName');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
