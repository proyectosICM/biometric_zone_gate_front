import { Dashboard } from "./pages/Dashboard";
import { DeviceConfiguration } from "./pages/DeviceConfiguration";
import { ZoneAccessLog } from "./pages/ZoneAccessLog";

export const routes = [
  { path: "/", component: <Dashboard /> },
  { path: "/zona-ingresos/:id", component: <ZoneAccessLog /> },
  { path: "/config-device", component: <DeviceConfiguration /> },
];
