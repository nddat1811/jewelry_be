import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dh5ixefa7",
  api_key: process.env.CLOUDINARY_API_KEY || "548273162889767",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "FgT65Q69lVBj4kDeO7f023iJR1E",
  secure: true,
});

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

export { cloudinary, options };
