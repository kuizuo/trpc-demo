import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
} from "next";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ctx: {},
    transformer: superjson,
  });
  const id = context.params?.id as string;

  // prefetch `post.byId`
  await ssg.post.byId.prefetch(id);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id,
      },
    })),
    // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};

export default function PostViewPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { id } = props;
  const postQuery = api.post.byId.useQuery(id);

  if (postQuery.status !== "success") {
    return <>Loading...</>;
  }
  
  const { data } = postQuery;
  return (
    <div className="mt-6 max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{data?.title}</h1>
      <div className="text-gray-500 text-sm mb-4">
        Updated {data?.updatedAt?.toLocaleDateString()}
      </div>
      <p className="text-lg mb-6">{data?.content}</p>
      <div className="text-gray-500 text-sm mb-2">Raw data: </div>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
}