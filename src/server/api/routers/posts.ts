import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return posts;
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input: id }) => {
    return ctx.prisma.post.findUnique({
      where: { id: id },
      include: { user: true },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      return post;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.prisma.post.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!owner) {
        throw new Error("Post not found");
      }

      const post = await ctx.prisma.post.update({
        where: { id: input.id },
        data: input,
      });
      return post;
    }),
  delete: protectedProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input: id }) => {
      const post = await ctx.prisma.post.findFirst({
        where: { id: id, userId: ctx.session.user.id },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      await ctx.prisma.post.delete({ where: { id } });
    }),
});
