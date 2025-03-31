import { Hono } from "hono";

const app = new Hono();

app.post("/", (ctx) => {
  return ctx.text("This is pr route");
});

export default app;