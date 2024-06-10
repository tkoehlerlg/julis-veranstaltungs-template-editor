import { cleanEnv, str, email, json } from 'envalid'

export const env = cleanEnv(process.env, {
    BASE_URL: str(),
    NODE_ENV: str({
        choices: ['development', 'test', 'production', 'staging'],
    }),
})
