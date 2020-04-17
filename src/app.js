const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!isUuid(id)) {
    return response.status(400).json({error: 'invalid project id'})
  }

  const repositoryIndex = repositories.findIndex( repo => repo.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: "repository ID not found"})
  }

  repositories[repositoryIndex] = {...repositories[repositoryIndex],  title, url, techs };

  return response.json(repositories[repositoryIndex]);
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repo => repo.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: "repository ID not found"})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find( repo => repo.id === id);

  if(!repository) {
    return response.status(400).json({error: "repository ID not found"})
  }

  repository.likes += 1;

  return response.json({likes: repository.likes});

});

module.exports = app;
