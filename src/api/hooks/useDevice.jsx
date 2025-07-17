import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as deviceService from "../services/deviceService";

export const useGetDeviceById = (id) => {
  return useQuery({
    queryKey: ["device", id],
    queryFn: () => deviceService.getDeviceById(id),
    enabled: !!id,
  });
};

// Enviar configuración a un device
export const useSendDeviceSettings = () => {
  return useMutation({
    mutationFn: ({ id, settingDTO }) => deviceService.sendDeviceSettings(id, settingDTO),
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deviceService.createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, deviceData }) => deviceService.updateDevice(id, deviceData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["device", id] });
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deviceService.deleteDevice,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      queryClient.removeQueries({ queryKey: ["device", id] });
    },
  });
};
