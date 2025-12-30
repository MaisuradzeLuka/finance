import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { usePostAccounts } from "../../api";

const Form = ({ onClose }: { onClose: () => void }) => {
  const postAccount = usePostAccounts();
  const [accountValue, setAccountValue] = useState("");
  const [error, setError] = useState<null | string>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setAccountValue(value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error) setError(null);

    if (!accountValue.trim()) {
      setError("Account name can not be empty");

      return;
    }

    const res = await postAccount.mutateAsync({ name: accountValue });

    if (res) {
      setAccountValue("");
      onClose();
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="mt-8 grid gap-2">
      <label htmlFor="name" className="font-medium">
        Name
      </label>

      <input
        id="name"
        name="name"
        type="text"
        className="border px-2 py-1 rounded-md outline-none overflow-hidden"
        placeholder="e.g Cash Bank Credit Card"
        value={accountValue}
        onChange={(e) => handleChange(e)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <Button
        variant="destructive"
        type="submit"
        className="bg-black cursor-pointer mt-2"
      >
        Add Account
      </Button>
    </form>
  );
};

export default Form;
