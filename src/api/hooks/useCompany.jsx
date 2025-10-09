import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as companyService from "../services/companyService";

export const useGetAllCompanies = () => {
    return useQuery({
        queryKey: ["companies"],
        queryFn: companyService.getAllCompanies,
    });
};

export const useGetAllCompaniesPaginated = (page, size, sortBy, direction) => {
    return useQuery({
        queryKey: ["companies", page, size, sortBy, direction],
        queryFn: () => companyService.getAllCompaniesPaginated(page, size, sortBy, direction),
        keepPreviousData: true,
    });
}; 

export const useGetCompanyById = (id) => {
    return useQuery({
        queryKey: ["company", id],
        queryFn: () => companyService.getCompanyById(id),
        enabled: !!id, 
    });
};

export const useCreateCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyService.createCompany,
        onSuccess: () => {
            queryClient.invalidateQueries(["companies"]);
        },
    });
};

export const useUpdateCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => companyService.updateCompany(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["companies"]);
        },
    });
};

export const useDeleteCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyService.deleteCompany,
        onSuccess: () => {
            queryClient.invalidateQueries(["companies"]);
        },
    });
};
