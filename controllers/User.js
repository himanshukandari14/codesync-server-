const cloudinary = require('cloudinary').v2;
const { cloudinaryConnect } = require('../config/Cloudinary');
const User = require('../models/User');


cloudinaryConnect();

async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}


exports.updateProfile = async (req, res) => {
  try {
    // Extract user data from the request object
    const userData = req.user;

    // Assuming the request body contains profile picture data
    const file = req.files.profilePicture;

    // Upload profile picture to Cloudinary
    const response = await uploadFileToCloudinary(file, "codesync");

    // Get the URL of the uploaded image
    const profilePictureUrl = response.secure_url;

   
    const updatedUser = await User.findByIdAndUpdate(userData.id, { image: profilePictureUrl }, { new: true });
    await updatedUser.save();

    // Return success response with updated user data
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePictureUrl,
      // updatedUser // Include the updated user data if needed
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile picture"
    });
  }
};
