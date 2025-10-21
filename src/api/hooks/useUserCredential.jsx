import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as credentialService from "../services/userCredentialService"; // 👈 asegúrate que este path sea correcto

// 🔹 Obtener todas las credenciales
export const useGetAllCredentials = () => {
  return useQuery({
    queryKey: ["credentials"],
    queryFn: credentialService.getAllCredentials,
  });
};

// 🔹 Obtener credenciales paginadas
export const useGetAllCredentialsPaginated = (page, size, sortBy, direction) => {
  return useQuery({
    queryKey: ["credentials", page, size, sortBy, direction],
    queryFn: () =>
      credentialService.getAllCredentialsPaginated(page, size, sortBy, direction),
    keepPreviousData: true,
  });
};

// 🔹 Obtener una credencial por ID
export const useGetCredentialById = (id) => {
  return useQuery({
    queryKey: ["credential", id],
    queryFn: () => credentialService.getCredentialById(id),
    enabled: !!id,
  });
};

// 🔹 Crear una nueva credencial
export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: credentialService.createCredential,
    onSuccess: () => {
      queryClient.invalidateQueries(["credentials"]);
    },
  });
};

// 🔹 Actualizar una credencial existente
export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => credentialService.updateCredential(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["credentials"]);
    },
  });
};

// 🔹 Eliminar una credencial
export const useDeleteCredential = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: credentialService.deleteCredential,
    onSuccess: () => {
      queryClient.invalidateQueries(["credentials"]);
    },
  });
};

// 🔹 Obtener credenciales por ID de usuario
export const useGetCredentialsByUserId = (userId) => {
  return useQuery({
    queryKey: ["credentialsByUser", userId],
    queryFn: () => credentialService.getCredentialsByUserId(userId),
    enabled: !!userId,
  });
};

// 🔹 Obtener credenciales por ID de usuario (paginadas)
export const useGetCredentialsByUserIdPaged = (
  userId,
  page,
  size,
  sortBy,
  direction
) => {
  return useQuery({
    queryKey: ["credentialsByUserPaged", userId, page, size, sortBy, direction],
    queryFn: () =>
      credentialService.getCredentialsByUserIdPaged(
        userId,
        page,
        size,
        sortBy,
        direction
      ),
    keepPreviousData: true,
    enabled: !!userId,
  });
};
