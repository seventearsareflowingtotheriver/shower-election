"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.post('/api/proposes', async (req, res) => {
    const { name, reason } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({ error: 'Імʼя кандидата обовʼязкове' });
        return;
    }
    try {
        const result = await db_1.default.query('INSERT INTO proposed_candidates (name, reason) VALUES ($1, $2) RETURNING *', [name.trim(), reason?.trim() || null]);
        await db_1.default.query(`
            INSERT INTO candidates (name, proposes) 
            VALUES ($1, 1)
            ON CONFLICT (name) 
            DO UPDATE SET proposes = candidates.proposes + 1
        `, [name.trim()]);
        res.status(201).json({
            message: 'Кандидата успішно запропоновано!',
            candidate: result.rows[0]
        });
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server internal error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
