import { Hono } from "hono";
import { config } from "@/utils/env";
import routes from "@/routes";
import { DiscordClient } from "@/clients/discord";

const app = new Hono();

DiscordClient.instance.start();

app.route("/", routes);

export default {
  port: config.PORT,
  fetch: app.fetch,
};


