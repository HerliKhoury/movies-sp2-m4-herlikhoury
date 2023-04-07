import express, {Application, json} from "express";
import { startDatabase } from "./database";
import { catchMovieById, createMovie, listMovies } from "./logic";
import { ensureMovieExistsMiddleware } from "./middlewares";

const app: Application = express();
app.use(express.json());

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.post("/movies", createMovie);
app.get("/movies", listMovies);
app.get("/movies/:id",ensureMovieExistsMiddleware , catchMovieById);
app.patch("/movies/:id", ensureMovieExistsMiddleware, /* middlewares & logic */ );
app.delete("/movies/:id", ensureMovieExistsMiddleware, /* middlewares & logic */);

app.listen(PORT, async() => {
    await startDatabase();
    console.log(runningMsg);
});
