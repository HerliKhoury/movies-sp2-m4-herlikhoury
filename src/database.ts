import { Client } from "pg";

export const client: Client = new Client({
    user: 'Hori_',
    host: 'localhost',
    port: 5432,
    password: '1234',
    database: 'movies_sp2_m4_herlikhoury',
});

export const startDatabase = async (): Promise<void> => {
    await client.connect();
    console.log('Database connected');
};

