package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"log"
)

type Todo struct {
	ID   string `json:"id"`
	Task string `json:"task"`
	Done bool   `json:"done"`
}

func main() {
	app := fiber.New()

	/*app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:63342/",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))*/

	//var todos []Todo
	todos := make(map[string]*Todo)

	app.Post("/api/todos/", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		todo.ID = uuid.New().String()
		//todos = append(todos, *todo)
		todos[todo.ID] = todo
		log.Println("Received Todos:", todos)
		return c.JSON(todos)
	})

	app.Patch("/api/todos/:id/done", func(ctx *fiber.Ctx) error {
		id := ctx.Params("id")

		todo, ok := todos[id]

		if !ok {
			return ctx.Status(fiber.StatusNotFound).SendString("Todo not found")
		}

		todo.Done = true
		return ctx.JSON(todo)

	})

	app.Get("/api/todos", func(ctx *fiber.Ctx) error {
		return ctx.JSON(todos)
	})

	app.Static("/", "../Client")

	app.Delete("/api/todos/:id", func(ctx *fiber.Ctx) error {
		id := ctx.Params("id")

		_, ok := todos[id]
		if !ok {
			return ctx.Status(fiber.StatusNotFound).SendString("Todo not found")
		}

		delete(todos, id)

		return ctx.SendStatus(fiber.StatusNoContent)
	})

	log.Fatal(app.Listen(":4000"))
}
