import express, {Application, json} from "express";
import { startDatabase } from "./database";
import { catchMovieById, createMovie, deleteMovie, listMovies, updateMovie } from "./logic";
import { ensureMovieExistsByIdMiddleware, ensureMovieExistsByNameMiddleware } from "./middlewares";

const app: Application = express();
app.use(express.json());

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.post("/movies", ensureMovieExistsByNameMiddleware, createMovie);
app.get("/movies", listMovies);
app.get("/movies/:id",ensureMovieExistsByIdMiddleware , catchMovieById);
app.patch("/movies/:id", ensureMovieExistsByIdMiddleware, ensureMovieExistsByNameMiddleware, updateMovie);
app.delete("/movies/:id", ensureMovieExistsByIdMiddleware, deleteMovie);

app.listen(PORT, async() => {
    await startDatabase();
    console.log(runningMsg);
});
