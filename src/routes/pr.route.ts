import { Hono } from "hono";

const app = new Hono();

app.post("/", (c) => {
  return c.text("This is pr route");
});

export default app;
