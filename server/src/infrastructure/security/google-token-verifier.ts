import { OAuth2Client } from 'google-auth-library';
import { IGoogleProfile, IGoogleTokenVerifier } from '../../domain/interfaces/services/IGoogleTokenVerifier';
import { env } from '../config/env';

export class GoogleAuthTokenVerifier implements IGoogleTokenVerifier {
  private _client = new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);

  async verifyIdToken(idToken: string): Promise<IGoogleProfile> {
    const ticket = await this._client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }
    return {
      email: payload.email,
      emailVerified: Boolean(payload.email_verified),
      name: payload.name || '',
      picture: payload.picture || '',
    };
  }
}
