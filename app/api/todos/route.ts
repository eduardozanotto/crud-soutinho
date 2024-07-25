import { todoController } from "@server/controller/todos";

export async function GET(request: Request, response: Response) {
  return todoController.get(request, response);
}

export async function POST(request: Request, response: Response) {
  return todoController.create(request, response);
}
