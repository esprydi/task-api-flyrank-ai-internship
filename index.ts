import express, { Request, Response } from 'express';
import console = require('node:console');
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

app.get('/tasks', (req: Request, res: Response) => {
    res.json(tasks);
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



 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 