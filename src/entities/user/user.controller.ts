import { Request, Response } from "express";
import { CreateUserInput, LoginInput, Tokens } from "./user.types";
import userService from "./user.service";
import cookiesService from "@/utils/cookies.service";

class UserController {
  async register(req: Request, res: Response) {
    try {
      const regData: CreateUserInput = req.body;
      const user = await userService.register(regData);

      return res.json({ message: "Вы успешно зарегистрировались", ...user });
    } catch (e) {
      const status =
        e instanceof Error && e.message.includes("уже существует") ? 409 : 500;
      const message =
        e instanceof Error && status === 409
          ? e.message
          : "Произошла ошибка при регистрации";

      return res.status(status).json({
        message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginData: LoginInput = req.body;
      const data = await userService.login(loginData);

      cookiesService.setCookies(res, data.tokens);

      res.json({ success: true, message: "Вы успешно вошли!" });
    } catch (e) {
      const status =
        e instanceof Error && e.message.includes("Неверный") ? 404 : 500;
      const message =
        e instanceof Error && status === 404
          ? e.message
          : "Произошла ошибка при регистрации";

      return res.status(status).json({
        success: false,
        message,
        
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = Object.keys(req.cookies)
      const tokens = Object.fromEntries(
        token.map((key, i) => [key, token[i]])
      ) as Tokens

      await userService.logout(res, tokens, req.cookies.refreshToken);
      
      res.json({ message: "Вы успешно вышли!" });
    } catch (e) {
      const status =
        e instanceof Error && e.message.includes("найден") ? 404 : 500;
      const message =
        e instanceof Error && status === 500 ? e.message : "Ошибка сервера!";

      return res.status(status).json({
        message,
      });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      const { tokens, user } = await userService.refresh(refreshToken);

      cookiesService.setCookies(res, tokens);

      return res.json({
        success: true,
        message: "Токены успешно обновлены",
        user,
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Ошибка обновления токенов";
      return res.status(401).json({
        success: false,
        message,
      });
    }
  }

  async checkAuth(req: Request, res: Response) {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        return res.status(401).json({ isAuth: false, message: "Токен истек!" });
      }

      const response = await userService.checkAuth(accessToken);

      return res.json({
        ...response,
      });
    } catch (e) {
      return res
        .status(401)
        .json({ isAuth: false, message: "Ошибка сервера!" });
    }
  }
}

export default new UserController();
