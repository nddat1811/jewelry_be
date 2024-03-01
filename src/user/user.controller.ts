import { Request, Response } from "express";
import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
} from "../helpers/constant";
import { returnResponse } from "../helpers/response";
import { userService } from "./user.service";
import { UpdateUserDto, UpdateUserPassword } from "./dto/update_user.dto";

/**
 * @swagger
 * /v1/user/test:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a product based on its ID.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               message: Product found successfully
 *               data:
 *                 id: "123"
 *                 name: "Sample Product"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: Product not found
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: Internal Server Error
 *               data: null
 */
const findUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    res.send("hi");
  } catch (error) {
    console.error("Error while finding product:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /v1/user/detail/{id}:
 *   get:
 *     summary: Get detail user by ID
 *     description: Retrieve a user based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *           default: 1
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               message: User found successfully
 *               data:
 *                 id: "1"
 *                 name: "test"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: User not found
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: Internal Server Error
 *               data: null
 */
const getDetailUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.params.id; // Assuming the ID is a string, adjust accordingly

    const foundProduct = await userService.getUserDetailById(userId);

    if (!foundProduct) {
      res.send(returnResponse(ERROR_NOT_FOUND, "User not found", null));
    } else {
      res.send(
        returnResponse(CODE_SUCCESS, "User found successfully", foundProduct)
      );
    }
  } catch (error) {
    console.error("Error while finding User:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /v1/user/update/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *           default: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The user role.
 *                 default: USER
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 default: Adam
 *               avatar:
 *                 type: string
 *                 description: The user's avatar.
 *                 default: image.jpg
 *               phone:
 *                 type: string
 *                 description: The user's phone.
 *                 default: 0975175333
 *               gender:
 *                 type: string
 *                 description: The user's gender.
 *                 default: NAM
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: The user's date.
 *                 default: '2024-12-03T00:00:00.000Z'  # Added single quotes to keep it as a string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               message: User updated successfully
 *               data:
 *                 id: "1"
 *                 name: "test"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: User not found
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: Internal Server Error
 *               data: null
 */
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const updateUserDto: UpdateUserDto = req.body;

    const [updatedUser, err] = await userService.updateUser(
      userId,
      updateUserDto
    );

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, updatedUser));
    } else {
      res.send(
        returnResponse(CODE_SUCCESS, "User updated successfully", updatedUser)
      );
    }
  } catch (error) {
    console.error("Error while processing users:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /v1/user/update_password/{id}:
 *   put:
 *     summary: Update user's password.
 *     description: Update user's password.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *           default: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's oldPassword.
 *                 default: test
 *               newPassword:
 *                 type: string
 *                 description: The user's name.
 *                 default: 11
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               message: User's password updated successfully
 *               data:
 *                 id: "1"
 *                 name: "test"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               code: 404
 *               message: User not found
 *               data: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: Internal Server Error
 *               data: null
 */
const updateUserPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const temp: UpdateUserPassword = req.body;
    // const oldPassword: string = req.body.oldPassword;
    // const newPassword: string = req.body.newPassword;

    const [updatedUser, err] = await userService.updateUserPassword(
      userId,
      temp
    );

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, updatedUser));
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "User's password updated successfully",
          updatedUser
        )
      );
    }
  } catch (error) {
    console.error("Error while processing users:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateAvatarUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const avatar = req.file;

    if (avatar) {
      const [updatedUser, err] = await userService.updateAvatarUser(
        userId,
        avatar
      );
      if (err) {
        res.send(returnResponse(ERROR_BAD_REQUEST, err.message, updatedUser));
      } else {
        res.send(
          returnResponse(CODE_SUCCESS, "User updated successfully", updatedUser)
        );
      }
    } else {
      res.send(returnResponse(ERROR_BAD_REQUEST, "not found file", null));
    }
  } catch (error) {
    console.error("Error while processing users:", error);
    res.status(500).send("Internal Server Error");
  }
};
export {
  findUserByEmail,
  getDetailUserById,
  updateUser,
  updateUserPassword,
  updateAvatarUser,
};
