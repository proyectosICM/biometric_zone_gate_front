import { AccessLogDetail } from "./pages/AccessLogDetail";
import { Administration } from "./pages/Administration";
import { AllowedUsersManager } from "./pages/AllowedUsersManager";
import { Dashboard } from "./pages/Dashboard";
import { DeviceConfiguration } from "./pages/DeviceConfiguration";
import { UserAccessDetails } from "./pages/UserAccessDetails";
import { UserAccessList } from "./pages/UserAccessList";
import { ZoneAccessLog } from "./pages/ZoneAccessLog";

export const routes = [
  { path: "/", component: <Dashboard /> },
  { path: "/zona-ingresos/:id", component: <ZoneAccessLog /> },
  { path: "/config-device/:id", component: <DeviceConfiguration /> },
  { path: "/detalle-ingreso/:id", component: <AccessLogDetail /> },
  { path: "/usuarios-permitidos/:id", component: <AllowedUsersManager /> },

  { path: "/user-access", component: <UserAccessList /> },
  { path: "/user-access/:id", component: <UserAccessDetails /> },
  { path: "/administracion", component: <Administration /> },
  {
    /* path: "/usuarios-permitidos/:id", component: <AllowedUsersManager /> */
  },
];
