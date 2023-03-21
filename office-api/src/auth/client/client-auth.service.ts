import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from '@prisma/client';
import { ClientsRepository } from 'src/app/client/client.repository';
import { validatePassword } from 'src/app/common/utils/hash-password';

@Injectable()
export class ClientAuthService {
  constructor(
    private clientsRepository: ClientsRepository,
    private jwtService: JwtService,
  ) {}

  async validateClient(
    email: string,
    password: string,
    office_id: string,
  ): Promise<Client | null> {
    console.log(office_id, email, password);
    if (!office_id || !email || !password) {
      return null;
    }

    const client = await this.clientsRepository.findByEmailAndOfficeId({
      email,
      office_id,
    });

    console.log(client);

    if (!client) {
      return null;
    }

    const validated = await validatePassword(password, client.password);

    if (!validated) {
      return null;
    }

    return client;
  }

  async clientLogin(client: Client) {
    const payload = {
      email: client.email,
      office_id: client.office_id,
      sub: client.id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
