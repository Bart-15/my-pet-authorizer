declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ENV variables here such as AWS_ACCESS_KEY_ID: string, etc...
      AWS_REGION: string;
      COGNITO_USER_POOL_ID: string;
    }
  }
}
