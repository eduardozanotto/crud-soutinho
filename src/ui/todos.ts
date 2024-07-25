import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
  page: number;
}
async function get(params: TodoControllerGetParams) {
  return todoRepository.get({
    page: params.page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  todos: Array<Todo & { content: string }>,
  search: string
): Todo[] {
  const actualTodos = todos.filter((currentTodo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = currentTodo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return actualTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onError: (errorMessage?: string[]) => void;
  onSuccess: (todo: Todo) => void;
}
function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  const parsedParams = schema
    .string()
    .min(1, "Content cannot be empty!")
    .safeParse(content);

  if (!parsedParams.success) {
    const errors = parsedParams.error?.issues;
    const errorMessage = errors?.map((err) => {
      return err.message.toString();
    });
    onError(errorMessage);
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
