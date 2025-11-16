import { CookieOptions, Request, Response, NextFunction } from "express";
import config from "config";
import { CreateUserInput, LoginUserInput } from "../schemas/user.shema";
import { CreateUser, FindUserByEmail, SignTokens } from "../services/user.services";
import { User } from "../entities/user.entity";
import AppError from "../utils/appError";
import {signJwt,verifyJwt} from "../utils/jwt"

// Cookie Options
const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

// Register User Controller

const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password, email } = req.body;

    const user = await CreateUser({
      name,
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with that email already exists",
      });
    }
    next(error);
  }
};

// Login User Controllers

const loginUserHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, passwords} = req.body;
        const user = await FindUserByEmail({email});

        // 1. Check if user exists and password is valid
        if(!user || (await User.comparePassword(passwords, user.password))) {
            return next(new AppError(400, 'Invalid email or password'));
        }

        // 2. Sign Access and Refresh Token
        const { access_token, refresh_token} = await SignTokens(user);

        // 3. Add Cookie
        res.cookie('access_token', access_token , accessTokenCookieOptions);
        res.cookie('refresh_token', refresh_token , refreshTokenCookieOptions);
        res.cookie('logged_in',true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        })

        res.status(200).json({
            status: 'success',
            access_token
        })
    } catch(error: any) {
        next(error);
    }
};

//  Refresh Access Token

const refreshAccessTokenHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refresh_token = req.cookies.refresh_token;

        const message = 'Could not refresh access token';

        if(!refresh_token){
            return next(new AppError(404,message));
        }

         // Validate refresh token
        const decoded = verifyJwt<{ sub: string}>(
          refresh_token,
          'refreshTokenPublicKey'
        )

        if(!decoded){
          return next(new AppError(404,message));
        }

        //Check if user has valid session
        

    } catch (error: any) {
        next(error);
    }
}

export {
    registerUserHandler as RegisterUserHandler,
    loginUserHandler as LoginUserHandler,

};
