import { getRepository } from "typeorm";
import { User } from "../models";
import { CreateUserDto } from "./dto/create_user.dto";
import { UserRole } from "../helpers/constant";

class UserRepository {
  async updateLastLogin(id: number): Promise<string | null> {
    const userRepository = getRepository(User);

    try {
      const result = await userRepository.update(id, { lastLogin: new Date() });

      if (result.affected === 0) {
        return "User not found";
      }
      return null;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }

  async findUserByEmail(emailInput: string): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneBy({
        email: emailInput,
      });

      return user;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching user:", error);
      throw error;
    }
  }
  async createNewUser(
    userInput: CreateUserDto
  ): Promise<[User | null, Error | null]> {
    const userRepository = getRepository(User);
    try {
      const newUser = userRepository.create({
        ...userInput,
        role: UserRole.USER,
      });
      const createdUser = await userRepository.save(newUser);

      return [createdUser, null];
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }

  async  getDetailUserById(
    id: number,
    flag: boolean
  ): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const queryBuilder = userRepository
        .createQueryBuilder("user")
        .select([
          "user.id",
          "user.role",
          "user.name",
          "user.phone",
          "user.email",
          "user.dob",
          "user.avatar",
          "user.dob",
          "user.gender",
          "user.lastLogin",
          "user.createdAt",
          "user.updatedAt",
        ]);

      if (flag) {
        queryBuilder
          .leftJoinAndSelect("user.userPayments", "payment")
          .leftJoinAndSelect("user.userAddresses", "address")
      }

      const user = await queryBuilder
        .where({
          id: id,
        })
        .getOne();

      return user;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getDetailUserToUpdateById(id: number): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async updateUser(updateUser: User): Promise<User | null> {
    const userRepository = getRepository(User);
    try {
      const updatedUser = await userRepository.save(updateUser);

      return updatedUser;
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }
}

const userRepository = new UserRepository();
export { userRepository };
