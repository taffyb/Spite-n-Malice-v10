// import {promisify} from 'util';
// // import {util} from 'util';
// import * as Axios from 'axios';
// import * as jsonwebtoken from 'jsonwebtoken';
// const jwkToPem = require('jwk-to-pem');

// export interface ClaimVerifyRequest {
//   readonly token?: string;
// }

// export interface ClaimVerifyResult {
//   readonly userName: string;
//   readonly userId: string;
//   readonly clientId: string;
//   readonly isValid: boolean;
//   readonly error?: any;
// }

// interface TokenHeader {
//   kid: string;
//   alg: string;
// }
// interface PublicKey {
//   alg: string;
//   e: string;
//   kid: string;
//   kty: string;
//   n: string;
//   use: string;
// }
// interface PublicKeyMeta {
//   instance: PublicKey;
//   pem: string;
// }

// interface PublicKeys {
//   keys: PublicKey[];
// }

// interface MapOfKidToPublicKey {
//   [key: string]: PublicKeyMeta;
// }

// interface Claim {
//   token_use: string;
//   sub: string;
//   auth_time: number;
//   iss: string;
//   exp: number;
//   "cognito:username": string;
//   client_id: string;
// }

// const cognitoPoolId = process.env.COGNITO_POOL_ID || 'eu-west-2_KHCND5Jvc';
// if (!cognitoPoolId) {
//   throw new Error('env var required for cognito pool');
// }
// const cognitoIssuer = `https://cognito-idp.eu-west-2.amazonaws.com/${cognitoPoolId}`;
// let cacheKeys: MapOfKidToPublicKey | undefined;
// const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
//   if (!cacheKeys) {
//     const url = `${cognitoIssuer}/.well-known/jwks.json`;
//     const publicKeys = await Axios.default.get<PublicKeys>(url);
//     cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
//       const pem = jwkToPem(current);
//       agg[current.kid] = {instance: current, pem};
//       return agg;
//     }, {} as MapOfKidToPublicKey);
//     return cacheKeys;
//   } else {
//     return cacheKeys;
//   }
// };

// const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

// const verifier = async (request: ClaimVerifyRequest): Promise<ClaimVerifyResult> => {
//   let result: ClaimVerifyResult;
//   try {
//     const token = request.token;
//     const tokenSections = (token || '').split('.');
//     if (tokenSections.length < 2) {
//       throw new Error('requested token is invalid');
//     }
//     const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
//     const header = JSON.parse(headerJSON) as TokenHeader;
//     const keys = await getPublicKeys();
//     const key = keys[header.kid];
//     if (key === undefined) {
//       throw new Error('claim made for unknown kid');
//     }
//     const claim = await verifyPromised(token, key.pem) as Claim;
//     console.log(`claim:\n ${JSON.stringify(claim,null,2)}`);
//     const currentSeconds = Math.floor( (new Date()).valueOf() / 1000);
//     if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
//       throw new Error('claim is expired or invalid');
//     }
//     if (claim.iss !== cognitoIssuer) {
//       throw new Error('claim issuer is invalid');
//     }
//     // if (claim.token_use !== 'access') {
//     //   console.log(`claim use is not access`);
//     //   throw new Error('claim use is not access');
//     // }
//     console.log(`claim confirmed for ${claim['cognito:username']}`);
//     result = {userName: claim['cognito:username'],userId:claim.sub, clientId: claim.client_id, isValid: true};
//   } catch (error) {
//     result = {userName: '',userId: '', clientId: '', error, isValid: false};
//   }
//   return result;
// };

// export {verifier};

