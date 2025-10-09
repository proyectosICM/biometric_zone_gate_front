import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userService from "../services/userService";

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: userService.getAllUsers,
    });
};

export const useGetAllUsersPaginated = (page, size, sortBy, direction) => {
    return useQuery({
        queryKey: ["users", page, size, sortBy, direction],
        queryFn: () =>
            userService.getAllUsersPaginated(page, size, sortBy, direction),
        keepPreviousData: true,
    });
};

export const useGetUserById = (id) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => userService.getUserById(id),
        enabled: !!id, // Solo ejecuta si existe ID
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => userService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });
};

export const useGetUserByEmail = (email) => {
    return useQuery({
        queryKey: ["userByEmail", email],
        queryFn: () => userService.getUserByEmail(email),
        enabled: !!email,
    });
};

export const useLoginUser = (username, password) => {
    return useQuery({
        queryKey: ["userLogin", username],
        queryFn: () =>
            userService.getUserByUsernameAndPassword(username, password),
        enabled: !!username && !!password,
    });
};

export const useGetUsersByCompanyId = (companyId) => {
    return useQuery({
        queryKey: ["usersByCompany", companyId],
        queryFn: () => userService.getUsersByCompanyId(companyId),
        enabled: !!companyId,
    });
};

export const useGetUsersByCompanyIdPaged = (
    companyId,
    page,
    size,
    sortBy,
    direction
) => {
    return useQuery({
        queryKey: ["usersByCompanyPaged", companyId, page, size, sortBy, direction],
        queryFn: () =>
            userService.getUsersByCompanyIdPaged(
                companyId,
                page,
                size,
                sortBy,
                direction
            ),
        keepPreviousData: true,
        enabled: !!companyId,
    });
};
