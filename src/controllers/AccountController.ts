import { Request, Response } from 'express';

import { AccountService } from '../services/AccountService';

export class AccountController {

  async list(request: Request, response: Response): Promise<Response> {
    const accountService = new AccountService();

    try {
      let { skip, take } = request.query;
      const skipN = Number(skip);
      const takeN = Number(take);
      const accounts = await accountService.list(skipN, takeN);

      return response.status(200).json({ data: accounts });
    } catch (e) {
      return response.status(400).json({
        error: e.message
      })
    }
  }

  async create(request: Request, response: Response): Promise<Response> {
    const accountService = new AccountService();

    try {
      const account = await accountService.create(request.body);

      return response.status(201).json(account);
    } catch (e) {
      return response.status(400).json({
        error: e.message
      })
    }
  }

  async update(request: Request, response: Response): Promise<Response> {
    const accountService = new AccountService();
    try {
      const { id } = request.params;
      const { address, phone } = request.body;
      const account = await accountService.update(id, { address, phone });
      return response.status(200).json(account);

    } catch (e) {
      return response.status(400).json({
        error: e.message
      })
    }
  }

  async activate(request: Request, response: Response): Promise<Response> {
    const accountService = new AccountService();
    try {
      const { id } = request.params;
      await accountService.activate(id);
      return response.status(204).json();
    } catch (e) {
      return response.status(400).json({
        error: e.message
      })
    }
  }

  async disable(request: Request, response: Response): Promise<Response> {
    const accountService = new AccountService();
    try {
      const { id } = request.params;
      await accountService.disable(id);
      return response.status(204).json();
    } catch (e) {
      return response.status(400).json({
        error: e.message
      })
    }
  }
}
