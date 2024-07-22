import { todoRepository } from "@server/repository/todo";

function get(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const query = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  };

  const page = Number(query.page);
  const limit = Number(query.limit);

  console.log(page);

  if (query.page && isNaN(page)) {
    JSON.stringify({
      error: { message: "Page must be a number!" },
    }),
      {
        status: 400,
      };
  }

  if (query.limit && isNaN(limit)) {
    JSON.stringify({
      error: { message: "Limit must be a number!" },
    }),
      {
        status: 400,
      };
  }

  const output = todoRepository.get({
    page: page,
    limit: limit,
  });

  return new Response(
    JSON.stringify({
      todos: output.todos,
      pages: output.pages,
      total: output.total,
    }),
    {
      status: 200,
    }
  );
}

export const todoController = {
  get,
};
