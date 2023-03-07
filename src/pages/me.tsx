import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Me() {
  const router = useRouter();

  const me = api.user.me.useQuery();
  const { data: user, status } = me;

  if (status !== "success") {
    return <>Loading...</>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <h2 className="mb-4 text-center">
          <span className="text-3xl text-[#398ccb]">Me</span>
        </h2>
        <div className="flex flex-col items-center gap-2">
          <Image src={user?.image ?? ""} alt="logo" width={100} height={100} />
          <div className="font-sans font-semibold"> {user?.name}</div>
          <div> {user?.email}</div>
        </div>
        <div className="text-center">
          <button
            className="mt-4 rounded-lg bg-[#398ccb] px-4 py-2 text-white"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
