import { TOKEN_CONFIG } from "../config/auth";
import { Tokens } from "../entities/user/user.types";
import { CookieOptions, Response } from "express";

class CookieService {
  setCookies(res: Response, tokens: Tokens) {
    res.cookie("accessToken", tokens.accessToken, {
      maxAge: TOKEN_CONFIG.accessExpIn,
      secure: true,
      sameSite: "none",
      domain: ".vercel.app",
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: TOKEN_CONFIG.refreshExpIn,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".vercel.app",
    });
  }

  deleteCookie(res: Response, name: string, payload?: CookieOptions) {
    res.clearCookie(name, payload);
  }
}

export default new CookieService();
