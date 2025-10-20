import { AccessLogDetail } from "./pages/AccessLogDetail";
import { BiometricCrud } from "./pages/admin/biometrics/BiometricCrud";
import { CompanyCrud } from "./pages/admin/companies/CompanyCrud";
import { EventTypeCrud } from "./pages/admin/eventType/EventTypeCrud";
import { UserCrud } from "./pages/admin/users/UserCrud";
import { Administration } from "./pages/Administration";
import { AllowedUsersManager } from "./pages/AllowedUsersManager";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { DeviceConfiguration } from "./pages/DeviceConfiguration";
import { Observations } from "./pages/Observations";
import { UserAccessDetails } from "./pages/UserAccessDetails";
import { UserAccessList } from "./pages/UserAccessList";
import { ZoneAccessLog } from "./pages/ZoneAccessLog";

export const routes = [
  { path: "/login", component: <Login /> },
  { path: "/", component: <Dashboard /> },
  { path: "/zona-ingresos/:deviceId", component: <ZoneAccessLog /> },
  { path: "/config-device/:deviceId", component: <DeviceConfiguration /> },
  { path: "/detalle-ingreso/:id", component: <AccessLogDetail /> },
  { path: "/usuarios-permitidos/:id", component: <AllowedUsersManager /> },

  { path: "/observations", component: <Observations /> },

  { path: "/user-access", component: <UserAccessList /> },
  { path: "/user-access/:userId", component: <UserAccessDetails /> },

  { path: "/administracion", component: <Administration /> },
  { path: "/users", component: <UserCrud /> },
  { path: "/companies", component: <CompanyCrud /> },
  { path: "/biometrics", component: <BiometricCrud /> },
  { path: "/event-types", component: <EventTypeCrud /> },


  {
    /* path: "/usuarios-permitidos/:id", component: <AllowedUsersManager /> */
  },
];
