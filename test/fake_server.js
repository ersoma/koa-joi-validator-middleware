'use strict';

const Koa = require('koa');

class FakeServer {
  constructor(
    middlewares = [],
    controller = ctx => { ctx.status = 200; }
  ) {
    const app = new Koa();
    middlewares.forEach(middleware => app.use(middleware));
    app.use(controller);
    app.silent = true;
    this.app = app;
  }

  startFakeServer(port) {
    this.stopFakeServer();
    return new Promise(resolve => {
      this.server = this.app.listen(port, '0.0.0.0', () => resolve());
    });
  }

  stopFakeServer() {
    if (this.server) {
      this.server.close();
    }
  }
}

module.exports = FakeServer;
