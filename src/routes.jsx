import { Dashboard } from "./pages/Dashboard";
import { ZoneAccessLog } from "./pages/ZoneAccessLog";

export const routes = [
  { path: "/", component: <Dashboard /> },
  { path: "/zona-ingresos/:id", component: <ZoneAccessLog /> },
];
