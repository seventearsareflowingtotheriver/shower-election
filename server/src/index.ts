import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/* GET all candidates */
/* app.get('/api/candidates', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM candidates');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}); */

/* POST a vote for a candidate */
/*app.post('/api/vote', async (req: Request, res: Response) => {
    const { candidate_id } = req.body;
    try {
        await pool.query('UPDATE candidates SET votes = votes + 1 WHERE id = $1', [candidate_id]);
        res.json({ message: 'Vote recorded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}); */

/* POST proposed candidate */
app.post('/api/proposes', async (req: Request, res: Response) => {
    const { name, reason } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({ error: 'Імʼя кандидата обовʼязкове' });
        return;
    }

    try {
        const result = await pool.query(
            'INSERT INTO proposed_candidates (name, reason) VALUES ($1, $2) RETURNING *',
            [name.trim(), reason?.trim() || null]
        );

        await pool.query(`
            INSERT INTO candidates (name, proposes) 
            VALUES ($1, 1)
            ON CONFLICT (name) 
            DO UPDATE SET proposes = candidates.proposes + 1
        `, [name.trim()]);

        res.status(201).json({
            message: 'Кандидата успішно запропоновано!',
            candidate: result.rows[0]
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server internal error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});