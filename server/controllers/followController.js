const User = require("../models/userModel");

exports.followUser = async (req, res) => {
  const currentUserId = req.userId;
 // from JWT token
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId)
    return res.status(400).json({ message: "You can't follow yourself." });

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found." });

    if (currentUser.following.includes(targetUserId))
      return res.status(400).json({ message: "You already follow this user." });

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "User followed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.unfollowUser = async (req, res) => {
const currentUserId = req.userId;

  const targetUserId = req.params.id;

  if (currentUserId === targetUserId)
    return res.status(400).json({ message: "You can't unfollow yourself." });

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found." });

    if (!currentUser.following.includes(targetUserId))
      return res.status(400).json({ message: "You are not following this user." });

    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "User unfollowed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Internal server error." });
  }
};
