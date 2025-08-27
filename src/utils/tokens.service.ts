import jwt, { verify, sign } from "jsonwebtoken";
import dotenv from "dotenv";
import { hash } from "bcrypt";
import prisma from "./prisma";
import { RefreshTokenPayload } from "../entities/user/user.types";
import { TOKEN_CONFIG } from "../config/auth";

dotenv.config();

class TokenService {
  async generateTokens(email: string, id: string) {
    const accessToken = sign(
      { email, id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: TOKEN_CONFIG.accessExpIn }
    );
    const refreshToken = sign(
      { email, id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: TOKEN_CONFIG.refreshExpIn }
    );

    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async verifyRefreshToken(token: string) {
    try {
      return verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token истёк");
      }
      throw new Error("Недействительный refresh token");
    }
  }
}

export default new TokenService();
