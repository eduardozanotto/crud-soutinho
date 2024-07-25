import { todoRepository } from "@server/repository/todo";
import { z as schema } from "zod";

async function get(req: Request) {
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

const TodoCreateSchema = schema.object({
  content: schema.string(),
});

async function create(req: Request) {
  const body = await req.json();
  const bodySchema = TodoCreateSchema.safeParse(body);

  if (!bodySchema.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: "You must provide a content!",
          description: bodySchema.error.issues,
        },
      }),
      {
        status: 400,
      }
    );
  }
  const createdTodo = await todoRepository.createByContent(
    bodySchema.data.content
  );

  return new Response(
    JSON.stringify({
      todo: createdTodo,
    }),
    {
      status: 201,
    }
  );
}

async function toggleDone(req: Request, todoId: string, res: Response) {
  const updateTodo = { id: todoId };

  if (!todoId || typeof todoId !== "string") {
    return new Response(
      JSON.stringify({
        error: {
          message: "You must provide an ID!",
        },
      }),
      {
        status: 400,
      }
    );
  }
  todoRepository.toggleDone(todoId);

  return new Response(
    JSON.stringify({
      todo: updateTodo,
    }),
    {
      status: 200,
    }
  );
}

export const todoController = {
  get,
  create,
  toggleDone,
};
