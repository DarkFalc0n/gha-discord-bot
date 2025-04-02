import { Hono } from 'hono';

const app = new Hono();

app.get('/', (ctx) => {
  return ctx.text('Server health: OK!');
});

export default app;
