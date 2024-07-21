import { read } from "@db-crud-todo";

function get(req: Request, res: Response) {
  const ALL_TODOS = read();

  return new Response(
    JSON.stringify({
      todos: ALL_TODOS,
    }),
    {
      status: 200,
    }
  );
}

export const todoController = {
  get,
};
