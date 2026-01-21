import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useEditCategory, useGetCategory } from "../../api";

const EditForm = ({ onClose, id }: { onClose: () => void; id: string }) => {
  const { data, isLoading, isError } = useGetCategory(id);
  const editCategory = useEditCategory();

  const [categoryValue, setCategoryValue] = useState("");
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (data?.name) {
      setCategoryValue(data.name);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading account data</div>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryValue(e.currentTarget.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!categoryValue.trim()) {
      setError("Category name can not be empty");
      return;
    }

    setError(null);

    const res = await editCategory.mutateAsync({
      name: categoryValue,
      id,
    });

    if (res) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-2">
      <label htmlFor="name" className="font-medium">
        Name
      </label>

      <input
        id="name"
        type="text"
        className="border px-2 py-1 rounded-md outline-none"
        value={categoryValue}
        onChange={handleChange}
      />

      {error && <p className="text-red-500">{error}</p>}

      <Button
        type="submit"
        className="bg-black text-white mt-2 cursor-pointer"
        disabled={editCategory.isPending}
      >
        Edit Category
      </Button>
    </form>
  );
};

export default EditForm;
