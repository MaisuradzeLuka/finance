import { client } from "@/lib/hono";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await client.api.categories.$get();

      if (!res.ok) {
        throw new Error("Error fetching categories");
      }

      return await res.json();
    },
  });

  return query;
};

export const useGetCategory = (id: string) => {
  const query = useQuery({
    queryKey: ["category", { id }],
    queryFn: async (c) => {
      const res = await client.api.categories[":id"].$get({ param: { id } });

      if (!res.ok) {
        throw new Error("Error fetching category");
      }

      return await res.json();
    },
  });

  return query;
};

type PostRequestType = InferRequestType<
  typeof client.api.categories.$post
>["json"];
type PostResponseType = InferResponseType<typeof client.api.categories.$post>;

export const usePostCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PostResponseType, Error, PostRequestType>({
    mutationFn: async (name) => {
      const res = await client.api.categories.$post({ json: name });

      return await res.json();
    },
    onSuccess: async () => {
      toast.success("Category added succesfuly");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("There was an error adding the category");
    },
  });

  return mutation;
};

type BulkDeleteRequestType = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];
type BulkDeleteResponseType = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkDeleteResponseType,
    Error,
    BulkDeleteRequestType
  >({
    mutationFn: async (ids) => {
      const res = await client.api.categories["bulk-delete"].$post({
        json: ids,
      });

      if (!res.ok) throw new Error("Failed to delete accounts");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Categories deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to delete categories");
    },
  });

  return mutation;
};

type EditRequestType = InferRequestType<
  typeof client.api.categories.$patch
>["json"];
type EditResponseType = InferResponseType<typeof client.api.categories.$patch>;

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<EditResponseType, Error, EditRequestType>({
    mutationFn: async (data) => {
      const res = await client.api.categories.$patch({ json: data });

      if (!res.ok) throw new Error("Failed to edit category");

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Categories edited successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to edit categories");
    },
  });

  return mutation;
};
