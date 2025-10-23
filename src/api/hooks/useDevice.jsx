import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as deviceService from "../services/deviceService";

// ---------- QUERIES ----------

// Obtener todos los dispositivos (sin paginar)
export const useGetAllDevices = () => {
  return useQuery({
    queryKey: ["devices"],
    queryFn: deviceService.getAllDevices,
  });
};

// Obtener dispositivos paginados
export const useGetAllDevicesPaginated = (page, size, sortBy, direction) => {
  return useQuery({
    queryKey: ["devices", page, size, sortBy, direction],
    queryFn: () =>
      deviceService.getAllDevicesPaginated(page, size, sortBy, direction),
    keepPreviousData: true,
  });
};

// Obtener dispositivo por ID
export const useGetDeviceById = (id) => {
  return useQuery({
    queryKey: ["device", id],
    queryFn: () => deviceService.getDeviceById(id),
    enabled: !!id,
  });
};

// Obtener dispositivo por nombre
export const useGetDeviceByName = (name) => {
  return useQuery({
    queryKey: ["deviceByName", name],
    queryFn: () => deviceService.getDeviceByName(name),
    enabled: !!name,
  });
};

// Listar dispositivos por empresa
export const useListByCompany = (companyId) => {
  return useQuery({
    queryKey: ["devicesByCompany", companyId],
    queryFn: () => deviceService.listByCompany(companyId),
    enabled: !!companyId,
  });
};

// Listar dispositivos por empresa (paginados)
export const useListByCompanyPaginated = (companyId, page, size, sortBy, direction) => {
  return useQuery({
    queryKey: ["devicesByCompany", companyId, page, size, sortBy, direction],
    queryFn: () =>
      deviceService.listByCompanyPaginated(companyId, page, size, sortBy, direction),
    keepPreviousData: true,
    enabled: !!companyId,
  });
};

// ---------- MUTATIONS ----------

// Crear dispositivo
export const useCreateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries(["devices"]);
    },
  });
};

// Actualizar dispositivo
export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => deviceService.updateDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["devices"]);
    },
  });
};

// Eliminar dispositivo
export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries(["devices"]);
    },
  });
};

// Sincronizar usuarios desde dispositivo
export const useSyncUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.syncUsers,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["device", id]);
    },
  });
};

// Enviar usuario a dispositivo
export const usePushUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, user }) => deviceService.pushUser(id, user),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["device", id]);
    },
  });
};

// Eliminar un usuario de un dispositivo
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }) => deviceService.deleteUser(id, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["device", id]);
    }, 
  });
};

// Limpiar todos los usuarios de un dispositivo
export const useClearAllUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.clearAllUsers,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["device", id]);
    },
  });
};

// Reiniciar dispositivo
export const useRebootDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.reboot,
    onSuccess: (_, id) => {
      console.log(`🔄 Dispositivo ${id} reiniciado correctamente.`);
      queryClient.invalidateQueries(["device", id]);
    },
    onError: (error) => {
      console.error("❌ Error al reiniciar el dispositivo:", error);
    },
  });
};

// Inicializar sistema (borrar usuarios y logs)
export const useInitializeSystem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.initializeSystem,
    onSuccess: (_, id) => {
      console.log(`🧹 Sistema del dispositivo ${id} inicializado correctamente.`);
      queryClient.invalidateQueries(["device", id]);
    },
    onError: (error) => {
      console.error("❌ Error al inicializar el sistema del dispositivo:", error);
    },
  });
};

// Limpiar administradores
export const useCleanAdmins = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.cleanAdmins,
    onSuccess: (_, id) => queryClient.invalidateQueries(["device", id]),
  });
};

// Sincronizar hora actual
export const useSyncDeviceTimeNow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.syncDeviceTimeNow,
    onSuccess: (_, id) => queryClient.invalidateQueries(["device", id]),
  });
};

// Sincronizar hora personalizada
export const useSyncDeviceTimeCustom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datetime }) =>
      deviceService.syncDeviceTimeCustom(id, datetime),
    onSuccess: (_, { id }) => queryClient.invalidateQueries(["device", id]),
  });
};

// Abrir puerta
export const useOpenDoor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.openDoor,
    onSuccess: (_, id) => queryClient.invalidateQueries(["device", id]),
  });
};

// Obtener info del dispositivo
export const useGetDeviceInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.getDeviceInfo,
    onSuccess: (_, id) => queryClient.invalidateQueries(["device", id]),
  });
};

// Limpiar logs
export const useCleanDeviceLogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.cleanDeviceLogs,
    onSuccess: (_, id) => queryClient.invalidateQueries(["device", id]),
  });
};

// Obtener nuevos logs
export const useGetNewLogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.getNewLogs,
    onSuccess: (_, id) => queryClient.invalidateQueries(["device", id]),
  });
};