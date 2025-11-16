import config from "config"
import { AppDataBase } from "../config/source.date";
import { User } from "../entities/user.entity";
import { signJwt } from "../utils/jwt"
import redisClient from '../config/redex.data';

const userRepository = AppDataBase.getRepository(User);

const createUser =  async (input : Partial<User>) => {
    return (await userRepository.save(userRepository.create(input)));
}

const findUserByEmail = async ({ email }: {email: string}) => {
    return await userRepository.findOneBy({ email});
}

const findUserById = async ( userId : string ) => {
    return await userRepository.findOneBy({ id: userId });
}

const findUser = async (query : Object) => {
    return await userRepository.findOneBy(query);
}

const signTokens = async (user: User) => {
    redisClient.set(user.id, JSON.stringify(user), {
        EX: config.get<number>('redisCacheExpiresIn') * 60
    });

    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return { access_token, refresh_token };
}

export {
    createUser as CreateUser,
    findUserByEmail as FindUserByEmail,
    findUserById as FindUserById,
    findUser as FindUser,
    signTokens as SignTokens
}