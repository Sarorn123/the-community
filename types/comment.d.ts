import { Comment, Prisma, Reply } from "@prisma/client";

export type CommentFullType = Prisma.CommentGetPayload<{ select: { [K in keyof Required<Prisma.CommentSelect>]: true } }>
export type CreateComment = Omit<Comment, "id" | "createdAt" | "updatedAt" | "isCorrect">;
export type ReplyFullType = Prisma.ReplyGetPayload<{ select: { [K in keyof Required<Prisma.ReplySelect>]: true } }>
export type CreateReply = Omit<Reply, "id" | "createdAt" | "updatedAt" | "isCorrect">;