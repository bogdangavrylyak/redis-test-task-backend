import * as joi from 'joi';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();

export interface Config {
  jwt_header: string;
  jwt_payload: string;
  jwt_secret_key: string;
  redis_url: string;
  redis_port: string;
}

dotenv.config({
  path: path.resolve(
    __dirname,
    (() => {
      return '../.env';
    })(),
  ),
});

export default (): Config => {
  const envVarsSchema = joi.object({
    jwt_secret_key: joi.string().required(),
    redis_url: joi.string().required(),
    redis_port: joi.string().required(),
  });

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(
      {
        jwt_secret_key: process.env.JWT_SECRET_KEY,
        redis_url: process.env.REDIS_URL,
        redis_port: process.env.REDIS_PORT,
      },
      { allowUnknown: true },
    );

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  const finalConfig = {
    ...envVars,

    jwt_header: {
      alg: 'HS256',
      typ: 'JWT',
    },
    jwt_payload: {
      user: 'John Doe',
    },
  };

  return finalConfig;
};
