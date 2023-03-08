import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";

function Posts() {
  const posts = api.post.all.useQuery();

  const mutation = api.post.delete.useMutation();
  const { data: sessiionData } = useSession();
  const user = sessiionData?.user;
  const { data, isLoading, error } = posts;

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await mutation.mutateAsync(postId);
        await posts.refetch();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center">
        <h1 className="flex-1 text-3xl font-bold">Posts</h1>
        <div className="flex gap-4">
          <Link
            href="/posts/new"
            className="rounded-lg bg-[#398ccb] px-4 py-2 text-white"
          >
            New Post
          </Link>
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-black border border-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79V20zm-2-1V9.978l-7-5.444l-7 5.444V19h14z"
              />
            </svg>
          </Link>
        </div>
      </div>
      {data.length > 0 ? (
        <ul className="space-y-6">
          {data?.map((post) => (
            <li
              key={post.id}
              className="relative overflow-hidden bg-white shadow sm:rounded-md"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="mb-2 text-3xl font-bold">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  <span className="ml-2 text-sm text-gray-500">
                    by {post.user.name}
                  </span>
                </div>
                <p className="mt-6 text-base text-gray-500">{post.content}</p>
                {post.user.id === user?.id && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="absolute bottom-4 right-2 cursor-pointer text-red-300 transition duration-500 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m20.37 8.91l-1 1.73l-12.13-7l1-1.73l3.04 1.75l1.36-.37l4.33 2.5l.37 1.37l3.03 1.75M6 19V7h5.07L18 11v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2m2 0h8v-6.8L10.46 9H8v10Z"
                      />
                    </svg>
                  </button>
                )}
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
