import express, { Request, Response } from 'express';
const app = express();
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
 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 