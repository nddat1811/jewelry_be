import { Request, Response } from "express";
import { returnResponse } from "../helpers/response";
import {
  CODE_CREATED_SUCCESS,
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
} from "../helpers/constant";
import { addressService } from "./address.service";
import CreateAddressDto from "./dto/create_address.dto";

/**
 * @openapi
 * /v1/address/list/{id}:
 *   get:
 *     summary: Get list address
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       '200':
 *         description: Successfully returned the list address of user
 *       '400':
 *         description: Failed to retrieve data
 */
const getListAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const response = await addressService.getListAddress(+userId);
    if (!response || response.length == 0) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Failed to retrieve data", response)
      );
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "Successfully returned the list address of user",
          response
        )
      );
    }
  } catch (error) {
    console.error("Error while processing list address of user:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/address/new/{id}:
 *   post:
 *     summary: Create a new address of user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *           default: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 description: The street name.
 *                 default: Trần Hưng Đạo
 *               city:
 *                 type: string
 *                 description: The city name.
 *                 default: Hồ CHí Minh
 *               phone:
 *                 type: string
 *                 description: The phone.
 *                 default: 0975175333
 *               name:
 *                 type: string
 *                 description: The name.
 *                 default: Đạt
 *               isDefault:
 *                 type: boolean
 *                 description: The city name.
 *                 default: false
 *     responses:
 *       '201':
 *         description: Product category created successfully
 *       '400':
 *         description: Bad request - Invalid input data
 */
const createNewAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const createAddressDto: CreateAddressDto = req.body;

    const [createdAddress, err] =
      await addressService.createAddress(
        +userId,
        createAddressDto
      );

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, createdAddress));
    } else {
      res.send(
        returnResponse(
          CODE_CREATED_SUCCESS,
          "Address created successfully",
          createdAddress
        )
      );
    }
  } catch (error) {
    console.error("Error while processing address:", error);
    res.status(500).send("Internal Server Error");
  }
};


/**
 * @openapi
 * /v1/address/update/{userID}/{addressID}:
 *   put:
 *     summary: Update address
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: ID of the user's address
 *         schema:
 *           type: string
 *           default: 1
 *       - in: path
 *         name:  addressID
 *         required: true
 *         description: ID of the user's address
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
 *               street:
 *                 type: string
 *                 description: The street name.
 *                 default: Trần Hưng Đạo
 *               city:
 *                 type: string
 *                 description: The city name.
 *                 default: Hồ CHí Minh
 *               phone:
 *                 type: string
 *                 description: The phone.
 *                 default: 0975175333
 *               name:
 *                 type: string
 *                 description: The name.
 *                 default: Đạt
 *               isDefault:
 *                 type: boolean
 *                 description: The city name.
 *                 default: false
 *     responses:
 *       '201':
 *         description: User's address updated successfully
 *       '400':
 *         description: Bad request - Invalid input data
 */
const updateAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addressId: string = req.params.addressID;
    const userId: string = req.params.userID;
    const updateAddressDto: CreateAddressDto = req.body;

    const [updatedAddress, err] =
      await addressService.updateAddress(
        +addressId,
        +userId,
        updateAddressDto
      );

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, updatedAddress));
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "Address updated successfully",
          updatedAddress
        )
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/address/set_default/{userID}/{addressID}:
 *   put:
 *     summary: set default address
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: ID of the user's address
 *         schema:
 *           type: string
 *           default: 1
 *       - in: path
 *         name:  addressID
 *         required: true
 *         description: ID of the user's address
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
 *               isDefault:
 *                 type: boolean
 *                 description: Set default.
 *                 default: false
 *     responses:
 *       '201':
 *         description: User's address updated successfully
 *       '400':
 *         description: Bad request - Invalid input data
 */
const setDefaultAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addressId: string = req.params.addressID;
    const userId: string = req.params.userID;
    const flag: boolean = req.body.isDefault;

    const [updatedAddress, err] =
      await addressService.setDefaultAddress(
        +addressId,
        +userId,
        flag
      );

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, updatedAddress));
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "Address updated successfully",
          updatedAddress
        )
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
export {
  createNewAddress,
  getListAddress,
  updateAddress,
  setDefaultAddress,
};
