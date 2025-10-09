import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as eventTypeService from "../services/eventTypeService";

export const useGetAllEventTypes = () => {
  return useQuery({
    queryKey: ["event-types"],
    queryFn: eventTypeService.getAllEventTypes,
  });
};

export const useGetEventTypeById = (id) => {
  return useQuery({
    queryKey: ["event-type", id],
    queryFn: () => eventTypeService.getEventTypeById(id),
    enabled: !!id, 
  });
};

export const useGetEventTypeByCode = (code) => {
  return useQuery({
    queryKey: ["event-type-code", code],
    queryFn: () => eventTypeService.getEventTypeByCode(code),
    enabled: !!code,
  });
};

export const useCreateEventType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventTypeService.createEventType,
    onSuccess: () => {
      queryClient.invalidateQueries(["event-types"]);
    },
  });
};

export const useUpdateEventType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => eventTypeService.updateEventType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["event-types"]);
    },
  });
};

export const useDeleteEventType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventTypeService.deleteEventType,
    onSuccess: () => {
      queryClient.invalidateQueries(["event-types"]);
    },
  });
};

export const useClearAllEventTypes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventTypeService.clearAllEventTypes,
    onSuccess: () => {
      queryClient.invalidateQueries(["event-types"]);
    },
  });
};
