import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DbHealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  checkConnection() {
    const s: number = this.connection.readyState; // 0,1,2,3
    return {
      status: s === 1 ? 'up' : 'down',
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][s],
    };
  }
}
