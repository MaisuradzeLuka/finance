import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useEditAccount, useGetAccount } from "../../api";

const EditForm = ({ onClose, id }: { onClose: () => void; id: string }) => {
  const { data, isLoading, isError } = useGetAccount(id);
  const editAccount = useEditAccount();

  const [accountValue, setAccountValue] = useState("");
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (data?.name) {
      setAccountValue(data.name);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading account data</div>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAccountValue(e.currentTarget.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!accountValue.trim()) {
      setError("Account name can not be empty");
      return;
    }

    setError(null);

    const res = await editAccount.mutateAsync({
      name: accountValue,
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
        value={accountValue}
        onChange={handleChange}
      />

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" className="bg-black text-white mt-2 cursor-pointer">
        Edit Account
      </Button>
    </form>
  );
};

export default EditForm;
