import { User } from "../models";
import { userRepository } from "./user.repository";
import { UpdateUserDto, UpdateUserPassword } from "./dto/update_user.dto";
import * as bcrypt from "bcrypt";
import { hashPassword } from "../helpers/hashPassword";
import { cloudinary, options } from "../utils/cloudinary";

class UserService {
  async getUserDetailById(userId: string): Promise<User | null> {
    try {
      const id = +userId;
      const user = await userRepository.getDetailUserById(id, true); // flag true --> query thêm payment và address
      return user;
    } catch (error) {
      console.error("Error while finding user by ID:", error);
      throw error; // You might want to handle this error more gracefully in a production environment
    }
  }
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<[User | null, Error | null]> {
    try {
      const existingUser = await userRepository.getDetailUserToUpdateById(
        +userId
      );

      if (existingUser) {
        // Merge properties from updateUserDto into existingUser
        const updatedUser = { ...existingUser, ...updateUserDto };

        // Update the user in the repository
        const savedUser = await userRepository.updateUser(updatedUser);

        if (!savedUser) {
          return [null, new Error("Failed to update user")];
        } else {
          return [savedUser, null];
        }
      } else {
        // User not found
        return [null, new Error("User not found")];
      }
    } catch (error) {
      console.error("Error updating user", error);
      throw error;
    }
  }

  async updateUserPassword(
    userId: string,
    temp: UpdateUserPassword
  ): Promise<[User | null, Error | null]> {
    try {
      const existingUser = await userRepository.getDetailUserToUpdateById(
        +userId
      );

      if (existingUser) {
        const checkPass = await bcrypt.compare(
          temp.oldPassword,
          existingUser.password ? existingUser.password : ""
        );
        if (!checkPass) {
          return [null, new Error("Password not correct")];
        }
        const password = hashPassword(temp.newPassword);
        const updatedUser = { ...existingUser, password };
        // // Update the user in the repository
        const savedUser = await userRepository.updateUser(updatedUser);

        if (!savedUser) {
          return [null, new Error("Failed to update user")];
        }

        return [savedUser, null];
      } else {
        // User not found
        return [null, new Error("User not found")];
      }
    } catch (error) {
      console.error("Error updating user", error);
      throw error;
    }
  }

  async updateAvatarUser(
    userId: string,
    avatar: Express.Multer.File
  ): Promise<[User | null, Error | null]> {
    try {
      const existingUser = await userRepository.getDetailUserToUpdateById(
        +userId
      );

      if (existingUser) {
        // Merge properties from updateUserDto into existingUser
        const path = avatar.path;
        const cloudinaryResult = await cloudinary.uploader.upload(path, {
          public_id: `${existingUser.id}`, // set name of file on Cloudinary
          ...options,
        });

        // uploadToCloudinary(avatar);
        existingUser.avatar = cloudinaryResult.url;

        // Update the user in the repository
        const savedUser = await userRepository.updateUser(existingUser);

        if (!savedUser) {
          return [null, new Error("Failed to update user")];
        } else {
          return [savedUser, null];
        }
      } else {
        // User not found
        return [null, new Error("User not found")];
      }
    } catch (error) {
      console.error("Error updating user", error);
      throw error;
    }
  }
}

const userService = new UserService();

export { userService };
