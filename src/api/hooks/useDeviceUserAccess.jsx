import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as deviceUserAccessService from "../services/deviceUserAccessService";

// ===============================
// QUERIES
// ===============================

// Obtener todos
export const useGetAllDeviceUserAccess = () => {
  return useQuery({
    queryKey: ["deviceUserAccess"],
    queryFn: deviceUserAccessService.getAllDeviceUserAccess,
  });
};

// Obtener paginados
export const useGetAllDeviceUserAccessPaged = (page, size, sortBy, direction) => {
  return useQuery({
    queryKey: ["deviceUserAccessPaged", page, size, sortBy, direction],
    queryFn: () =>
      deviceUserAccessService.getAllDeviceUserAccessPaged(
        page,
        size,
        sortBy,
        direction
      ),
    keepPreviousData: true,
  });
};

// Obtener por ID
export const useGetDeviceUserAccessById = (id) => {
  return useQuery({
    queryKey: ["deviceUserAccess", id],
    queryFn: () => deviceUserAccessService.getDeviceUserAccessById(id),
    enabled: !!id,
  });
};

// ===============================
// FILTROS PERSONALIZADOS
// ===============================

// Por usuario
export const useGetByUserId = (userId) => {
  return useQuery({
    queryKey: ["deviceUserAccessByUser", userId],
    queryFn: () => deviceUserAccessService.getByUserId(userId),
    enabled: !!userId,
  });
};

export const useGetByUserIdPaged = (userId, page, size, sortBy, direction) => {
  return useQuery({
    queryKey: ["deviceUserAccessByUserPaged", userId, page, size, sortBy, direction],
    queryFn: () =>
      deviceUserAccessService.getByUserIdPaged(userId, page, size, sortBy, direction),
    keepPreviousData: true,
    enabled: !!userId,
  });
};

// Por dispositivo
export const useGetByDeviceId = (deviceId) => {
  return useQuery({
    queryKey: ["deviceUserAccessByDevice", deviceId],
    queryFn: () => deviceUserAccessService.getByDeviceId(deviceId),
    enabled: !!deviceId,
  });
};

export const useGetByDeviceIdPaged = (deviceId, page, size, sortBy, direction) => {
  return useQuery({
    queryKey: ["deviceUserAccessByDevicePaged", deviceId, page, size, sortBy, direction],
    queryFn: () =>
      deviceUserAccessService.getByDeviceIdPaged(deviceId, page, size, sortBy, direction),
    keepPreviousData: true,
    enabled: !!deviceId,
  });
};

// Por dispositivo habilitado
export const useGetByDeviceIdAndEnabledTrue = (deviceId, page, size) => {
  return useQuery({
    queryKey: ["deviceUserAccessByDeviceEnabled", deviceId, page, size],
    queryFn: () =>
      deviceUserAccessService.getByDeviceIdAndEnabledTrue(deviceId, page, size),
    keepPreviousData: true,
    enabled: !!deviceId,
  });
};

// Por grupo
export const useGetByGroupNumber = (groupNumber) => {
  return useQuery({
    queryKey: ["deviceUserAccessByGroup", groupNumber],
    queryFn: () => deviceUserAccessService.getByGroupNumber(groupNumber),
    enabled: !!groupNumber,
  });
};

export const useGetByGroupNumberPaged = (
  groupNumber,
  page,
  size,
  sortBy,
  direction
) => {
  return useQuery({
    queryKey: [
      "deviceUserAccessByGroupPaged",
      groupNumber,
      page,
      size,
      sortBy,
      direction,
    ],
    queryFn: () =>
      deviceUserAccessService.getByGroupNumberPaged(
        groupNumber,
        page,
        size,
        sortBy,
        direction
      ),
    keepPreviousData: true,
    enabled: !!groupNumber,
  });
};

// Solo habilitados
export const useGetEnabled = () => {
  return useQuery({
    queryKey: ["deviceUserAccessEnabled"],
    queryFn: deviceUserAccessService.getEnabled,
  });
};

export const useGetEnabledPaged = (page, size, sortBy, direction) => {
  return useQuery({
    queryKey: ["deviceUserAccessEnabledPaged", page, size, sortBy, direction],
    queryFn: () =>
      deviceUserAccessService.getEnabledPaged(page, size, sortBy, direction),
    keepPreviousData: true,
  });
};

// Por usuario + dispositivo
export const useGetByUserAndDevice = (userId, deviceId) => {
  return useQuery({
    queryKey: ["deviceUserAccessByUserAndDevice", userId, deviceId],
    queryFn: () =>
      deviceUserAccessService.getByUserAndDevice(userId, deviceId),
    enabled: !!userId && !!deviceId,
  });
};

// Por usuario + dispositivo habilitado
export const useGetByUserAndDeviceEnabled = (userId, deviceId) => {
  return useQuery({
    queryKey: ["deviceUserAccessByUserAndDeviceEnabled", userId, deviceId],
    queryFn: () =>
      deviceUserAccessService.getByUserAndDeviceEnabled(userId, deviceId),
    enabled: !!userId && !!deviceId,
  });
};

// ===============================
// MUTATIONS
// ===============================

// Crear
export const useCreateDeviceUserAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceUserAccessService.createDeviceUserAccess,
    onSuccess: () => {
      queryClient.invalidateQueries(["deviceUserAccess"]);
    },
  });
};

// Actualizar
export const useUpdateDeviceUserAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      deviceUserAccessService.updateDeviceUserAccess(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["deviceUserAccess"]);
    },
  });
};

// Eliminar
export const useDeleteDeviceUserAccess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceUserAccessService.deleteDeviceUserAccess,
    onSuccess: () => {
      queryClient.invalidateQueries(["deviceUserAccess"]);
    },
  });
};
