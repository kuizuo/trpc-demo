import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

function Posts() {
  const router = useRouter();
  const posts = api.post.all.useQuery();

  const { data, isLoading } = posts;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center">
        <h1 className="flex-1 text-3xl font-bold">Posts</h1>
        <button
          className="rounded-lg bg-[#398ccb] px-4 py-2 text-white"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
      {data!.length > 0 ? (
        <ul className="space-y-6">
          {data?.map((post) => (
            <li
              key={post.id}
              className="overflow-hidden bg-white shadow sm:rounded-md"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="mb-2 text-3xl font-bold">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  <span className="ml-2 text-sm text-gray-500">
                    by {post.user.name}
                  </span>
                </div>
                <p className="mt-6 text-base text-gray-500">{post.content}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xl font-bold">No posts yet</div>
      )}
    </div>
  );
}

export default Posts;
