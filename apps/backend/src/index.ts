import { Express } from 'express';
import { onRequest } from 'firebase-functions/https';
import { container, setupDIContainer } from './core/di-config';
import { Environment } from './utils';

export default class Server {
  constructor(private readonly app: Express) {
    this.app = container.resolve('app');
  }
  async start(): Promise<void> {
    try {
      console.log('====================================================');
      console.log(`| ${Environment.getNodeEnv().toUpperCase()} MODE`);

      const port = Environment.getAppPort();
      await this.app.listen(port);

      console.log(`| SERVER STARTED [${port}]`);
      console.log('====================================================');
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }
}


setupDIContainer();
const app = container.resolve('app');
(new Server(app)).start().catch(err => console.error(err.message));

export const api = onRequest(app);
