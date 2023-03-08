import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

async function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: session } = useSession();
  if (!session) {
    await router.push("http://localhost:3000/api/auth/signin");
    return null;
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const mutation = api.post.create.useMutation();
    const post = await mutation.mutateAsync({ title, content });

    console.log(post);
    await router.push("/posts/");
  };

  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center">
        <h1 className="flex-1 text-3xl font-bold">New Post</h1>
        <button
          className="rounded-lg bg-[#398ccb] px-4 py-2 text-white"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block font-bold text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="mb-2 block font-bold text-gray-700"
          >
            Content
          </label>
          <textarea
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewPost;
