import { Vote } from "@prisma/client";

export type CreateQuestion = Omit<Question, "id" | "createdAt" | "updatedAt">;
export type QuestionFullType = Prisma.QuestionGetPayload<{ select: { [K in keyof Required<Prisma.QuestionSelect>]: true } }>
export type CreateVote = Omit<Vote, "id">;