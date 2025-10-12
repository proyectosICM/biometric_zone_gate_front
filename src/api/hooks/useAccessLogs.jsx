import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as accessLogsService from "../services/accessLogsService";

export const useGetAllAccessLogs = () => {
    return useQuery({
        queryKey: ["access-logs"],
        queryFn: accessLogsService.getAllAccessLogs,
    });
};

export const useGetAllAccessLogsPaginated = (page, size, sortBy, direction) => {
    return useQuery({
        queryKey: ["access-logs", page, size, sortBy, direction],
        queryFn: () =>
            accessLogsService.getAllAccessLogsPaginated(page, size, sortBy, direction),
        keepPreviousData: true,
    });
};

export const useGetAccessLogById = (id) => {
    return useQuery({
        queryKey: ["access-log", id],
        queryFn: () => accessLogsService.getAccessLogById(id),
        enabled: !!id,
    });
};

export const useCreateAccessLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accessLogsService.createAccessLog,
        onSuccess: () => {
            queryClient.invalidateQueries(["access-logs"]);
        },
    });
};

export const useUpdateObservation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, observation }) =>
            accessLogsService.updateObservation(id, observation),
        onSuccess: () => {
            queryClient.invalidateQueries(["access-logs"]);
        },
    });
};

export const useDeleteAccessLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accessLogsService.deleteAccessLog,
        onSuccess: () => {
            queryClient.invalidateQueries(["access-logs"]);
        },
    });
};

export const useGetLogsByUser = (userId) => {
    return useQuery({
        queryKey: ["access-logs", "user", userId],
        queryFn: () => accessLogsService.getLogsByUser(userId),
        enabled: !!userId,
    });
};

export const useGetLogsByUserPaginated = (userId, page, size, sortBy, direction) => {
    return useQuery({
        queryKey: ["access-logs", "user", userId, page, size, sortBy, direction],
        queryFn: () =>
            accessLogsService.getLogsByUserPaginated(userId, page, size, sortBy, direction),
        keepPreviousData: true,
        enabled: !!userId,
    });
};

export const useGetLogsByDevice = (deviceId) => {
    return useQuery({
        queryKey: ["access-logs", "device", deviceId],
        queryFn: () => accessLogsService.getLogsByDevice(deviceId),
        enabled: !!deviceId,
    });
};

export const useGetLogsByDevicePaginated = (deviceId, page, size, { sortBy, direction }) => {
    return useQuery({
        queryKey: ["access-logs", "device", deviceId, page, size, sortBy, direction],
        queryFn: () =>
            accessLogsService.getLogsByDevicePaginated(deviceId, page, size, sortBy, direction),
        keepPreviousData: true,
        enabled: !!deviceId,
    });
};

export const useGetLogsByCompany = (companyId) => {
    return useQuery({
        queryKey: ["access-logs", "company", companyId],
        queryFn: () => accessLogsService.getLogsByCompany(companyId),
        enabled: !!companyId,
    });
};

export const useGetLogsByCompanyPaginated = (companyId, page, size, sortBy, direction) => {
    return useQuery({
        queryKey: ["access-logs", "company", companyId, page, size, sortBy, direction],
        queryFn: () =>
            accessLogsService.getLogsByCompanyPaginated(companyId, page, size, sortBy, direction),
        keepPreviousData: true,
        enabled: !!companyId,
    });
};

export const useGetLogsByAction = (action) => {
    return useQuery({
        queryKey: ["access-logs", "action", action],
        queryFn: () => accessLogsService.getLogsByAction(action),
        enabled: !!action,
    });
};

export const useGetLogsByActionPaginated = (action, page, size, sortBy, direction) => {
    return useQuery({
        queryKey: ["access-logs", "action", action, page, size, sortBy, direction],
        queryFn: () =>
            accessLogsService.getLogsByActionPaginated(action, page, size, sortBy, direction),
        keepPreviousData: true,
        enabled: !!action,
    });
};

export const useCountLogsByDeviceAndDay = (deviceId, date) => {
    return useQuery({
        queryKey: ["access-logs", "count", deviceId, date],
        queryFn: () => accessLogsService.countLogsByDeviceAndDay(deviceId, date),
        enabled: !!deviceId && !!date, // solo ejecuta si ambos existen
    });
};

export const useGetLatestLogsByDeviceToday = (deviceId) => {
    return useQuery({
        queryKey: ["access-logs", "device", deviceId, "latest-today"],
        queryFn: () => accessLogsService.getLatestLogsByDeviceToday(deviceId),
        enabled: !!deviceId,
        staleTime: 1000 * 60,
    });
};