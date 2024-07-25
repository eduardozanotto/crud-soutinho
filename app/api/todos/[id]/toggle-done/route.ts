import { todoController } from "@server/controller/todos";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
  response: Response
) {
  return todoController.toggleDone(request, params.id, response);
}
