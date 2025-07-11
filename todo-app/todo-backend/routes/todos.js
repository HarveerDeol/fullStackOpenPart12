const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const{ getAsync, setAsync } = require('../redis')


/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

router.get('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)
  res.send(todo);
});

router.put("/:id", async (request, response, next) => {
  const { text, done } = request.body;
  try {
    const todo = await Todo.findById(request.params.id);

    todo.text = text;
    todo.done = done;

    await todo.save();
    const current = await getAsync('added_todos');
    const count = current ? parseInt(current) + 1 : 1;
    await setAsync('added_todos', count);
    response.json(todo);
  } catch (error) {
    next(error);
    console.log("No change occured");
  }
});


/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)



module.exports = router;
