import { createConnection, getConnection, Entity, getRepository, Connection } from 'typeorm';

import { Account } from '../src/entities/Account';
import { AccountService } from '../src/services/AccountService';

describe('Dado um AccountService', () => {

  let conn: Connection;
  let accountService: AccountService;

  beforeAll(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Account],
      synchronize: true,
      logging: false
    });
  })

  beforeEach(async () => {
    conn = getConnection();
    accountService = new AccountService();
  });

  test('Não posso cadastrar uma conta sem CPF', async () => {
    const account = new Account();
    account.name = 'Conta';

    expect(async () => {
      await accountService.create(account);
    }).rejects.toThrow('CPF é obrigatório');
  });

  test('Não posso cadastrar uma conta sem Nome', async () => {
    const account = new Account();
    account.cpf = '91575883090';

    expect(async () => {
      await accountService.create(account);
    }).rejects.toThrow('Nome é obrigatório');
  });

  test('Não posso cadastrar uma conta com o mesmo cpf mais de uma vez', async () => {
    const account = new Account();
    const cpf = '91575883090';
    account.name = 'Conta';
    account.cpf = cpf;
    account.phone = '85999776655';
    account.address = 'Rua A';

    await accountService.create(account);

    expect(async () => {
      const newAccount = new Account();
      newAccount.name = 'Outra Conta';
      newAccount.cpf = cpf;

      await accountService.create(newAccount);
    }).rejects.toThrow('Não é permitido cadastrar duas contas com o mesmo CPF.');
  });

  afterAll(() => {
    conn.close();
  })
});
