import { Role } from "src/commons/enum/enums";

export interface AccessTokenPayload {
  _id: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  role: Role;
  changePassword: boolean
}

export interface RefreshTokenPayload {
  jti: string;
  sub: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}