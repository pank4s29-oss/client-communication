import crypto from 'node:crypto';
export function verifyLineSignature(body:string, signature:string| null, secret=process.env.LINE_CHANNEL_SECRET||''){ if(!signature||!secret)return false; const digest=crypto.createHmac('sha256',secret).update(body).digest('base64'); return digest.length===signature.length&&crypto.timingSafeEqual(Buffer.from(digest),Buffer.from(signature)); }
