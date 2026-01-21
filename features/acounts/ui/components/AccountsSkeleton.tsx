import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const AccountsSkeleton = () => {
  return (
    <div className="pageWrapper">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-3xl font-bold">Accounts Page</h2>
        <Button
          disabled
          className="bg-black text-white px-4 py-5 rounded-md mt-4 mb-10 w-full md:w-max text-md font-normal"
        >
          Add New Account
        </Button>
      </div>

      <div>
        <Input
          disabled
          placeholder="Filter names..."
          className="max-w-sm border-gray-400 outline-0 ring-0! mt-4"
        />

        <div className="flex flex-col gap-4 mt-12">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className=" h-10 rounded-md bg-gray-300" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountsSkeleton;
