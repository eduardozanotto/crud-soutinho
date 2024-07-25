"use client";

import React from "react";
import { GlobalStyles } from "@ui/theme/GlobalStyles";
import { todoController } from "@ui/todos";

//const bg = "https://mariosouto.com/cursos/crudcomqualidade/bg";
const bg = "/bg.jpg";

interface HomeTodo {
  id: string;
  content: string;
}

export default function Page() {
  const initialLoadComplete = React.useRef(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [todos, setTodos] = React.useState<HomeTodo[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [newTodoContent, setTodoNewContent] = React.useState("");

  const actualTodos = todoController.filterTodosByContent<HomeTodo>(
    todos,
    search
  );

  const hasMorePages = totalPages > page;
  const hasNoTodos = actualTodos.length == 0 && !isLoading;

  React.useEffect(() => {
    if (!initialLoadComplete.current) {
      todoController
        .get({ page })
        .then(({ todos, pages }) => {
          setTodos(todos);
          setTotalPages(pages);
        })
        .finally(() => {
          setIsLoading(false);
          initialLoadComplete.current = true;
        });
    }
  }, []);
  return (
    <main>
      <GlobalStyles themeName="indigo" />
      <header
        style={{
          backgroundImage: `url('${bg}')`,
        }}
      >
        <div className="typewriter">
          <h1>O que fazer hoje?</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            todoController.create({
              content: newTodoContent,
              onSuccess(todo: HomeTodo) {
                setTodos((oldTodos) => {
                  return [todo, ...oldTodos];
                });
                setTodoNewContent("");
              },
              onError(errorMessage) {
                alert(errorMessage || "");
              },
            });
          }}
        >
          <input
            type="text"
            placeholder="Correr, Estudar..."
            value={newTodoContent}
            onChange={function newTodoHandler(event) {
              setTodoNewContent(event.target.value);
            }}
          />
          <button type="submit" aria-label="Adicionar novo item">
            +
          </button>
        </form>
      </header>

      <section>
        <form>
          <input
            type="text"
            placeholder="Filtrar lista atual, ex: Dentista"
            onChange={function handleSearch(event) {
              setSearch(event.target.value);
            }}
          />
        </form>

        <table border={1}>
          <thead>
            <tr>
              <th align="left">
                <input type="checkbox" disabled />
              </th>
              <th align="left">Id</th>
              <th align="left">Conteúdo</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {actualTodos.map((currentTodo) => {
              return (
                <tr key={currentTodo.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{currentTodo.id.substring(0, 4)}</td>
                  <td>{currentTodo.content}</td>
                  <td align="right">
                    <button data-type="delete">Apagar</button>
                  </td>
                </tr>
              );
            })}

            {isLoading && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  Carregando...
                </td>
              </tr>
            )}

            {hasNoTodos && (
              <tr>
                <td colSpan={4} align="center">
                  Nenhum item encontrado
                </td>
              </tr>
            )}

            {hasMorePages && (
              <tr>
                <td colSpan={4} align="center" style={{ textAlign: "center" }}>
                  <button
                    data-type="load-more"
                    onClick={() => {
                      setIsLoading(true);
                      const nextPage = page + 1;
                      setPage(nextPage);
                      todoController
                        .get({ page: nextPage })
                        .then(({ todos, pages }) => {
                          setTodos((oldTodos) => {
                            return [...oldTodos, ...todos];
                          });
                          setTotalPages(pages);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    Página {page}, Carregar mais{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: "4px",
                        fontSize: "1.2em",
                      }}
                    >
                      ↓
                    </span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
