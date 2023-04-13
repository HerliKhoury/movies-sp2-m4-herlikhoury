import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { Imovie } from "./interfaces";
import { client } from "./database";

export const ensureMovieExistsByIdMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const id: number = parseInt(req.params.id);

    const queryString: string = `
        SELECT
            *
        FROM
            movies
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };

    const queryResult: QueryResult<Imovie> = await client.query(queryConfig);

    if (queryResult.rowCount === 0) {
        return res.status(404).json({
            error: "Movie not found!"
        })
    }

    res.locals.movie = queryResult.rows[0];

    return next();
};


export const ensureMovieExistsByNameMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const movieName: string = req.body.name;

    if(movieName){
        const queryStringName: string = `
            SELECT
                *
            FROM
                movies
            WHERE name = $1;
        `;

        const queryConfigName: QueryConfig = {
            text: queryStringName,
            values: [movieName]
        }

        const queryResultName: QueryResult<Imovie> = await client.query(queryConfigName);

        if(queryResultName.rowCount === 0){
            return next();
        } else{
            return res.status(409).json({
                "error": "Movie name already exists!"
            });
        };
    };


    return next();
}