import { deleteQuestion } from "@/controller/question";

export async function DELETE(request: Request, { params }: { params: { questionId: string } }) {
    return await deleteQuestion(params.questionId);
}