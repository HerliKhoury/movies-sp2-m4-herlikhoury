import { client } from "./database";
import { Request, Response } from "express";
import { Imovie } from "./interfaces";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";

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
    
    const movieCategory = req.query.category;

    if(movieCategory){
        const queryStringCategory: string = `
            SELECT
                *
            FROM
                movies
            WHERE category = $1;
        `;

        const queryConfig: QueryConfig = {
            text: queryStringCategory,
            values: [movieCategory],
        };

        const queryResult: QueryResult<Imovie> = await client.query(queryConfig);
        
        if(queryResult.rowCount === 0){
            const queryStringCategoryFail: string = `
                SELECT
                    *
                FROM
                    movies;
            `;

            const queryResultFail: QueryResult<Imovie> = await client.query(queryStringCategoryFail);
            return res.json(queryResultFail.rows);
        }
        
        return res.json(queryResult.rows);
    }

    const queryString: string = `
        SELECT
            *
        FROM
            movies;
    `;

    const queryResult: QueryResult<Imovie> = await client.query(queryString);
    return res.json(queryResult.rows);
};

export const catchMovieById = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const movie: Imovie = res.locals.movie;

    return res.json(movie);
};

export const updateMovie =  async (
    req: Request,
    res: Response
): Promise<Response>=> {
    const movieData: Partial<Imovie> = req.body;
    const id: number = parseInt(req.params.id);

    const queryString: string = format(
        `
        UPDATE
            movies
            SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(movieData),
        Object.values(movieData)
    );

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };

    const queryResult: QueryResult<Imovie> = await client.query(queryConfig);

    return res.json(queryResult.rows[0]);
};

export const deleteMovie = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const id: number = parseInt(req.params.id);

    const queryString: string = `
        DELETE FROM
            movies
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };

    await client.query(queryConfig);

    return res.status(204).send();
};
