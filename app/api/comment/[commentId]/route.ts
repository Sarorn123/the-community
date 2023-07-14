import { deleteComment, toggleCorrectComment } from "@/controller/comment";

export async function DELETE(request: Request, { params }: { params: { commentId: string } }) {
    return await deleteComment(params.commentId);
}

export async function PATCH(request: Request, { params }: { params: { commentId: string } }) {
    return await toggleCorrectComment(params.commentId)
}