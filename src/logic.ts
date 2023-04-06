import { client } from "./database";
import { Request, Response } from "express";
import { Imovie } from "./interfaces";
import { QueryConfig, QueryResult } from "pg";

export const createMovie = async (
    req: Request, res: Response
): Promise<Response> => {
    const movieData: Imovie = req.body;

    const queryString: string = `
        INSERT INTO
        movies
            (name, category, duration, price)
        VALUES
            ($1, $2, $3, $4)
        RETURNING *;
    `;
    const query = `
        SELECT * FROM movies;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(movieData),
    };

    const queryResult: QueryResult<Imovie> = await client.query(queryConfig);
    return res.status(201).json(queryResult.rows[0]);
};

export const listMovies = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const queryString: string = `
        SELECT
            *
        FROM
            movies;
    `;

    const queryResult: QueryResult<Imovie> = await client.query(queryString);
    return res.json(queryResult.rows);
};






