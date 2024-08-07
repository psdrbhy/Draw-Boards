import { UserIdentity } from "convex/server";
import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
];
// 获取认证信息
async function getUserIdentity(ctx: any): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  return identity;
}
// create
export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserIdentity(ctx);
    // 随机背景图片
    const randomImage = images[Math.floor(Math.random() * images.length)];

    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });
    return board;
  },
});
// delete
export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity =  await getUserIdentity(ctx);
    // 删除boards的时候也需要清除与收藏表的关系
    const existingFavorite = await ctx.db
    .query("userFavorites")
    .withIndex(
      "by_user_board",
      (q) => q.eq("userId", identity.subject).eq("boardId", args.id)
    )
      .unique();
    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id)
    }
    await ctx.db.delete(args.id);

  },
});
// update
export const update = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    await getUserIdentity(ctx);
    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required!");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters!");
    }
    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });
    return board;
  },
});
// favorite
export const favorite = mutation({
  args: {
    id: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserIdentity(ctx);

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }
    const userId = identity.subject;
    // 判断是否收藏
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();
      // 已经收藏就进行报错
    if (existingFavorite) {
      throw new Error("Board already favorited");
    }
    // 否则插入一条新的收藏记录
    await ctx.db.insert("userFavorites", {
      orgId: board.orgId,
      userId,
      boardId: board._id,
    });

    return board;
  },
});
// unfavorite
export const unfavorite = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await getUserIdentity(ctx);

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;
    // 看是否收藏
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex(
        "by_user_board",
        (q) => q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();
 
    if (!existingFavorite) {
      throw new Error("Favorited board not found");
    }
    // 有就删除
    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

// get:获取boardId
export const get = query({
  args: {
    id:v.id("boards")
  },
  handler: async (ctx,args) => {
    const board = ctx.db.get(args.id)
    return board
  }
})
