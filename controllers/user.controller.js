import { ApiErrorClass } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = req.body;

  //validate the inputs
  if (!username || !email || !password || !fullname) {
    throw new ApiErrorClass(
      400,
      "Please provide all the required fields",
      false
    );
  }

  //check if the user already exists
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new ApiErrorClass(409, "User already exists", false);
  }

  //check for the avatar and coverImage
  const avatarImagePath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  //upload the files on cloudinary
  const avatar = await uploadOnCloudinary(avatarImagePath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  //create the user
  const user = await User.create({
    username,
    email,
    password,
    fullname,
    avatar: avatar?.url || "",
    coverImage: avatar?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiErrorClass(
      500,
      "Something went wrong, User not created",
      false
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully", true));
});

export { registerUser };
