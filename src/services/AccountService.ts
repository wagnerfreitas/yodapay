import { Account } from './../entities/Account';

import { getCustomRepository, Repository } from 'typeorm';

import { AccountRepository } from '../repositories/AccountRepository';

type AccountUpdate = {
  address: string;
  phone: string;
}

export class AccountService {
  private _accountRepository: Repository<Account>;

  constructor() {
    this._accountRepository = getCustomRepository(AccountRepository);
  }

  async list(skip: number = 0, take: number = 10): Promise<Account[]> {
    return await this._accountRepository.find({
      skip,
      take
    });
  }

  async create(account: Account): Promise<Account> {
    account = this._accountRepository.create(account);
    const errors = await this.validAccount(account);
    if (errors.length > 0) {
      throw new Error(errors.reduce((e, current) => !!e ? `${e}, ${current}` : current, ''));
    }
    

    
    await this._accountRepository.save(account);
    
    return account;
  }

  async update(id: string, { address, phone }: AccountUpdate): Promise<Account>  {
    const account: Account = await this._accountRepository.findOne({
      id
    });
    
    if (!account) {
      throw new Error("Conta não encontrada");
    }

    account.address = address;
    account.phone = phone;
    await this._accountRepository.save(account);
    return account;
  }

  async activate(id: string): Promise<void> {
    await this.toggleAccount(id, true);
  }

  async disable(id: string): Promise<void> {
    await this.toggleAccount(id, false);
  }

  private async toggleAccount(id: string, isActive: boolean): Promise<void> {
    const account: Account = await this._accountRepository.findOne({
      id
    });
    
    if (!account) {
      throw new Error("Conta não encontrada");
    }

    account.isActive = isActive;
    await this._accountRepository.save(account);
  }

  private async validAccount(account: Account): Promise<string[]> {
    const errors: string[] = [];
    if (!account.cpf) {
      errors.push("CPF é obrigatório");
    }
    if (!account.name) {
      errors.push("Nome é obrigatório");
    }
    const acountExists = await this._accountRepository.findOne({
      cpf: account.cpf
    });
    if (acountExists) {
      errors.push("Não é permitido cadastrar duas contas com o mesmo CPF.");
    }
    return errors;
  }
}
