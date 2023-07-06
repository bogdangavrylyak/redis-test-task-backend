import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService<Config>) {}

  public decodeJWT(jwt: string): {
    header: {
      alg: string;
      typ: string;
    };
    payload: {
      user: string;
    };
  } {
    const [encodedHeader, encodedPayload, signature] = jwt.split('.');

    const decodedHeader = JSON.parse(this.base64UrlDecode(encodedHeader));
    const decodedPayload = JSON.parse(this.base64UrlDecode(encodedPayload));

    const calculatedSignature = createHmac(
      'sha256',
      this.configService.get('jwt_secret_key'),
    )
      .update(encodedHeader + '.' + encodedPayload)
      .digest('base64');

    const isSignatureValid =
      signature === this.base64UrlEncode(calculatedSignature);

    if (!isSignatureValid) {
      throw new HttpException(`Wrong JWT token`, HttpStatus.FORBIDDEN);
    }

    return { header: decodedHeader, payload: decodedPayload };
  }

  private base64UrlDecode(data) {
    let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = 4 - (base64.length % 4);
    base64 += '==='.slice(0, paddingLength);
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  public generateJWT() {
    const encodedHeader = this.base64UrlEncode(
      JSON.stringify(this.configService.get('jwt_header')),
    );
    const encodedPayload = this.base64UrlEncode(
      JSON.stringify(this.configService.get('jwt_payload')),
    );

    const signature = createHmac(
      'sha256',
      this.configService.get('jwt_secret_key'),
    )
      .update(encodedHeader + '.' + encodedPayload)
      .digest('base64');

    const jwt = `${encodedHeader}.${encodedPayload}.${this.base64UrlEncode(
      signature,
    )}`;
    return jwt;
  }

  private base64UrlEncode(data: string): string {
    let base64 = Buffer.from(data).toString('base64');
    base64 = base64.replace(/=/g, '');
    base64 = base64.replace(/\+/g, '-');
    base64 = base64.replace(/\//g, '_');
    return base64;
  }
}
