import { hash } from "bcrypt";
import {
  CreateUserInput,
  LoginInput,
  RefreshTokenPayload,
  Tokens,
} from "./user.types";
import tokensService from "../../utils/tokens.service";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";
import { verify } from "jsonwebtoken";
import cookiesService from "@/utils/cookies.service";
import { Response } from "express";

class UserService {
  async register(data: CreateUserInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });
    if (existingUser)
      throw new Error(
        "Пользователь с таким email или номером телефона уже существует!"
      );

    const hashedPassword = await hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return user;
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error("Неверный email или пароль");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Неверный email или пароль");
    }

    const tokens = await tokensService.generateTokens(user.email, user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { tokens, user };
  }

  async logout(res: Response, tokens: Tokens, refreshToken: string) {
    const decoded = await tokensService.verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) throw new Error("Пользователь не найден!");

    await prisma.user.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });

    cookiesService.deleteCookie(res, tokens.accessToken);
    cookiesService.deleteCookie(res, tokens.refreshToken, { httpOnly: true });
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new Error("Refresh token не предоставлен");

    const decoded = await tokensService.verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        refreshToken: true,
      },
    });

    if (!user) {
      throw new Error("Недействительный refresh token");
    }

    const tokens = await tokensService.generateTokens(user.email, user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async checkAuth(accessToken: string) {
    const decoded = verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET!
    ) as RefreshTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return { isAuth: false, message: "Пользователь не найден!" };
    }

    return { isAuth: true, user };
  }
}

export default new UserService();
