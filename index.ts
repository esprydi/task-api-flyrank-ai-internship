import express, { Request, Response } from 'express';
import console = require('node:console');
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./openapi.json";
const app = express();
interface Task {
    id: number;
    title: string;
    done: boolean;
}

let tasks: Task[] = [
    {
        id: 1,
        title: "Task 1",
        done: false
    },
    {
        id: 2,
        title: "Task 2",
        done: false
    }
]

const port= 3000;

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get("/", (req: Request, res: Response) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoint: ["/task"]
    });
});

app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok"
    })
})

app.get('/stats', (req: Request, res: Response) => {
    const total = tasks.length;
    const doneCount = tasks.filter(t => t.done === true).length;
    const openCount = total - doneCount;
    res.json({ total: total, done: doneCount, open: openCount });
});

app.post('/reset', (req: Request, res: Response) => {
    tasks = [
        { id: 1, title: "Task 1", done: false },
        { id: 2, title: "Task 2", done: false },
        { id: 3, title: "Buy Book", done: false }
    ];
    res.json({ message: "Tasks reset to default" });
});

app.get('/tasks', (req: Request, res: Response) => {
    let result = tasks;

    // Filter by done status
    if (req.query.done !== undefined) {
        const isDone = req.query.done === 'true';
        result = result.filter(t => t.done === isDone);
    }

    // Search by title
    if (req.query.search !== undefined) {
        const keyword = (req.query.search as string).toLowerCase();
        result = result.filter(t => t.title.toLowerCase().includes(keyword));
    }

    res.json(result);
})

app.post('/tasks', (req: Request, res: Response) => {
    const { title } = req.body;
    if(!title){
        return res.status(400).json({ error: 'Task title is required'});
    }

    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask: Task = { id: newId, title, done: false};

    tasks.push(newTask);
    res.status(201).json(newTask);
    
    
})

app.get('/tasks/:id', (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: `Task with ID ${taskId} not found`});
    }
})

app.put('/tasks/:id', (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const { title, done } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found`});
    }  

    if (title === undefined && done === undefined){
        return res.status(400).json({ error: `No update data provided`});
    }

    if (title !== undefined)
        tasks[taskIndex].title = title;
    if (done !== undefined)
        tasks[taskIndex].done = done;
    
    res.json(tasks[taskIndex]);
})

app.delete("/tasks/:id", (req:Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task with ID ${taskId} not found`});
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
})
  

 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 