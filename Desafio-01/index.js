const express = require("express");

const server = express();

server.use(express.json());

//Array para salvar as informações
const projetos = [];
let cont = 0;

server.use((rec, resp, next) => {
  cont++;
  console.log(`The number of routes called was ${cont}`);
  next();
});

function checkProjectExists(req, res, next) {
  const id = projetos[req.params.id];

  if (!id) {
    return res.status(400).json({ error: "Task does not exists. " });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const json = `{ "id": "${id}", "title": "${title}", "task": "[Nova tarefa]" }`;

  projetos.push(json);

  return res.send();
});

server.get("/projects", (req, res) => {
  return res.json(projetos);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const obj = JSON.parse(projetos[id]);
  obj.title = title;
  projetos[id] = JSON.stringify(obj);

  return res.json(projetos);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  projetos.splice(id, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const obj = JSON.parse(projetos[id]);
  obj.task = title;
  projetos[id] = JSON.stringify(obj);

  return res.json(projetos);
});

server.listen(3000);
