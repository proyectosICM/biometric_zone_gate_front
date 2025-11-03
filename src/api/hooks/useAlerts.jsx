// src/api/hooks/useAlerts.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as alertService from "../services/alertService";

// ---------- GETS ----------
export const useGetAlertById = (id) => {
  return useQuery({
    queryKey: ["alert", id],
    queryFn: () => alertService.getAlertById(id),
    enabled: !!id,
  });
};

export const useGetAllAlerts = () => {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: alertService.getAllAlerts,
  });
};

export const useGetAllAlertsPaginated = (
  page,
  size,
  sort = "createdAt",
  direction = "DESC"
) => {
  return useQuery({
    queryKey: ["alerts", "paged", page, size, sort, direction],
    queryFn: () => alertService.getAllAlertsPaginated(page, size, sort, direction),
    keepPreviousData: true,
  });
};

export const useGetAlertsByCompanyId = (companyId) => {
  return useQuery({
    queryKey: ["alertsByCompany", companyId],
    queryFn: () => alertService.getAlertsByCompanyId(companyId),
    enabled: !!companyId,
  });
};

export const useGetAlertsByCompanyIdPaged = (
  companyId,
  page,
  size,
  sort = "createdAt",
  direction = "DESC"
) => {
  return useQuery({
    queryKey: ["alertsByCompany", "paged", companyId, page, size, sort, direction],
    queryFn: () =>
      alertService.getAlertsByCompanyIdPaged(companyId, page, size, sort, direction),
    keepPreviousData: true,
    enabled: !!companyId,
  });
};

// Helpers “recientes”
export const useGetRecentAlerts = (limit = 5) => {
  return useQuery({
    queryKey: ["alerts", "recent", limit],
    queryFn: () => alertService.getRecentAlerts(limit),
  });
};

export const useGetRecentAlertsByCompany = (companyId, limit = 5) => {
  return useQuery({
    queryKey: ["alertsByCompany", "recent", companyId, limit],
    queryFn: () => alertService.getRecentAlertsByCompany(companyId, limit),
    enabled: !!companyId,
  });
};

// ---------- MUTATIONS ----------
export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertService.createAlert,
    onSuccess: () => {
      // Invalidar todo lo relacionado a alerts
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alertsByCompany"] });
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => alertService.updateAlert(id, data),
    onSuccess: (_data, variables) => {
      // Actualiza detalle e invalida listados
      queryClient.invalidateQueries({ queryKey: ["alert", variables?.id] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alertsByCompany"] });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertService.deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alertsByCompany"] });
    },
  });
};
