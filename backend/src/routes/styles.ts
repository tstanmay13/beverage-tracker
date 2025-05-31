import express, { Request, Response } from 'express';
import { pool } from '../index';

const router = express.Router();

// Get all styles
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, short_name, description 
       FROM styles 
       ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching styles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 