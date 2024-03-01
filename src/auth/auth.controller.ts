import { Request, Response } from "express";
import {
  CODE_CREATED_SUCCESS,
  CODE_LOGOUT_SUCCESS,
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  ERROR_CONFLICT,
  ERROR_FORBIDDEN,
} from "../helpers/constant";
import { returnResponse } from "../helpers/response";
import { userRepository } from "../user/user.repository";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../user/dto/create_user.dto";
import { User } from "../models";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { hashPassword } from "../helpers/hashPassword";
dotenv.config();

interface JwtPayload {
  email: string;
  name: string;
  sub: string;
  role: string;
}

/**
 * @openapi
 * /v1/auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticate a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: test
 *               password:
 *                 type: string
 *                 default: 123
 *     responses:
 *       '200':
 *         description: Successfully authenticated
 *       '400':
 *         description: Invalid email or password
 *       '500':
 *         description: Internal Server Error
 */
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.send(
        returnResponse(
          ERROR_BAD_REQUEST,
          "Please input email and password",
          null
        )
      );
    }

    const user: User | null = await userRepository.findUserByEmail(email);

    const userPassword = user?.password || "";
    const checkPass = await bcrypt.compare(password, userPassword);

    if (!user || !checkPass) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Email or password invalid", null)
      );
      return;
    }

    const payload: JwtPayload = {
      sub: String(user.id),
      email: user.email ? String(user.email) : "",
      name: user.name ? String(user.name) : "",
      role: user.role,
    };

    const accessTokenOptions: SignOptions & { algorithm: "HS512" } = {
      expiresIn: "1d",
      algorithm: "HS512",
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: "30d",
      algorithm: "HS512",
    };

    let accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET ?? "123",
      accessTokenOptions
    );
    let refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET ?? "456",
      refreshTokenOptions
    );
    // const tokenCache = {
    //   id: String(user.id),
    //   tokens: [{ accessToken, refreshToken }],
    // };
    const cookiesName: string | undefined = process.env.COOKIES_NAME;
    if (accessToken && cookiesName) {
      res.cookie(cookiesName, accessToken);
      console.log("cookie: ", cookiesName);
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    const t = await userRepository.updateLastLogin(user.id);
    if (t) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Error update last login", null)
      );
      return;
    }
    res.send(
      returnResponse(CODE_SUCCESS, "Login success", {
        id: user.id,
        role: user.role,
        name: user.name,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    console.error("Error while processing product categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/auth/register:
 *   post:
 *     summary: register
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 default: test
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 default: test
 *               phone:
 *                 type: string
 *                 description: The user's phone.
 *                 default: '0975456662'  # Added single quotes to keep it as a string
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 default: test@gmail.com
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
 *       '200':
 *         description: Successfully registered
 *       '400':
 *         description: Invalid input data
 *       '500':
 *         description: Internal Server Error
 */
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const createUser: CreateUserDto = req.body;

    if (!createUser) {
      res.send(returnResponse(ERROR_BAD_REQUEST, "Invalid input ", null));
      return;
    }

    const existEmailUser: User | null = await userRepository.findUserByEmail(
      createUser.email
    );

    if (existEmailUser) {
      res.send(returnResponse(ERROR_CONFLICT, "Email already used ", null));
      return;
    }
    //hash password
    const hashedPassword = hashPassword(createUser.password);
    createUser.password = hashedPassword;

    const [createdUser, err] = await userRepository.createNewUser(createUser);

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, createdUser));
      return;
    } else {
      res.send(
        returnResponse(
          CODE_CREATED_SUCCESS,
          "User created successfully",
          createdUser
        )
      );
      return;
    }
  } catch (error) {
    console.error("Error while processing User:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies["jwt"];
    if (!refreshToken) {
      res.send(returnResponse(ERROR_FORBIDDEN, "Invalid refresh token", null));
      return;
    }

    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET ?? "456"
    ) as JwtPayload;

    if (!decode) {
      res.send(returnResponse(ERROR_FORBIDDEN, "Invalid refresh token", null));
      return;
    }

    const payload: JwtPayload = {
      sub: String(decode.sub),
      email: decode.email ? String(decode.email) : "",
      name: decode.name ? String(decode.name) : "",
      role: decode.role,
    };

    const accessTokenOptions: SignOptions & { algorithm: "HS512" } = {
      expiresIn: "1d",
      algorithm: "HS512",
    };

    let accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET ?? "123",
      accessTokenOptions
    );
    res.send(
      returnResponse(
        CODE_SUCCESS,
        "Access token refreshed successfully",
        accessToken
      )
    );
  } catch (error) {
    console.error("Error while processing User:", error);
    res.status(500).send("Internal Server Error");
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies["jwt"];
    if (!refreshToken) {
      res.send(returnResponse(ERROR_FORBIDDEN, "Invalid refresh token", null));
      return;
    }

    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET ?? "456"
    ) as JwtPayload;

    const t = await userRepository.updateLastLogin(+decode.sub);
    if (t) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Error update last login", null)
      );
      return;
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });
    res.send(returnResponse(CODE_LOGOUT_SUCCESS, "Logout successfully", null));
  } catch (error) {
    console.error("Error while processing User:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { login, register, handleRefreshToken, logout };
