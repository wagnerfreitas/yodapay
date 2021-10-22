import { Router } from 'express';

import { AccountController } from './controllers/AccountController';

const routes = Router();

const accountController = new AccountController();

routes.get('/accounts', accountController.list);
routes.post('/accounts', accountController.create);
routes.put('/accounts/:id', accountController.update);
routes.patch('/accounts/:id/activate', accountController.activate);
routes.patch('/accounts/:id/disable', accountController.disable);

export { routes };
