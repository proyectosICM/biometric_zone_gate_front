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
