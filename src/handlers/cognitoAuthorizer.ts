/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Callback, Context } from 'aws-lambda';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import jwt from 'jsonwebtoken';

import { generateCognitoPublicKey } from '../lib/generateCognitoPublicKey';
import { generatePolicy } from '../lib/generatePolicy';

export const handler = async (
  event: APIGatewayProxyEventV2 & { methodArn: string },
  context: Context,
  callback: Callback
) => {
  const token = event.headers.Authorization?.split(' ')[1];

  if (!token) {
    return callback('Unauthorized');
  }

  try {
    const publicKey = await generateCognitoPublicKey(token);
    const decodedToken = jwt.verify(token, publicKey);

    const policy = generatePolicy(decodedToken?.sub, event.methodArn);
    return callback(null, { ...policy, context: decodedToken });
  } catch (error) {
    console.log('catch error. Invalid token', error);
    return callback('Unauthorized');
  }
};
