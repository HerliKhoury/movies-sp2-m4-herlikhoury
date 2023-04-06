import express, {Application, json} from "express";
import { startDatabase } from "./database";
import { createMovie, listMovies } from "./logic";

const app: Application = express();
app.use(express.json());

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.listen(PORT, async() => {
    await startDatabase();
    console.log(runningMsg);
});

app.post('/movies', createMovie);
app.get('/movies', listMovies);
