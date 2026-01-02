export interface IGoogleProfile {
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string;
}

export interface IGoogleTokenVerifier {
  verifyIdToken(idToken: string): Promise<IGoogleProfile>;
}
