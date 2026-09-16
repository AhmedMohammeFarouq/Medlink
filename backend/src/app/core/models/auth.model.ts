export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: number | string;
    email: string;
    name?: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}
