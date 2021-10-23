import { createConnection, getConnection, Entity, getRepository, Connection } from 'typeorm';

import { Account } from '../src/entities/Account';
import { AccountService } from '../src/services/AccountService';

describe('Dado um AccountService', () => {

  let conn: Connection;
  let accountService: AccountService;

  beforeAll(() => {
    return createConnection({
      type: "sqlite",
      database: ":memory:",
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
    account.name = "Conta";

    expect(async () => {
      accountService.create(account); 
    }).rejects.toThrowError('CPF é obrigatório');
  });

  afterAll(() => {
    conn.close();
  })
});
