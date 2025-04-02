import { Hono } from 'hono';
import PRRoute from '@/routes/pr.route';
import HealthRoute from '@/routes/health.route';

const app = new Hono();

app.route('/', HealthRoute);
app.route('/pr', PRRoute);

export default app;
