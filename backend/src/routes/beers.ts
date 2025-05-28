import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { CreateBeerDTO, UpdateBeerDTO } from '../types/beer';

const router = Router();

// Get all beers
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM beers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching beers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single beer
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM beers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Beer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching beer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new beer
router.post('/', async (req: Request, res: Response) => {
  try {
    const beer: CreateBeerDTO = req.body;
    const { name, brewery, style, abv, rating, image_url, notes } = beer;
    
    const result = await pool.query(
      'INSERT INTO beers (name, brewery, style, abv, rating, image_url, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, brewery, style, abv, rating, image_url, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating beer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a beer
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateBeerDTO = req.body;
    
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = Object.values(updates);
    
    const result = await pool.query(
      `UPDATE beers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Beer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating beer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a beer
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM beers WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Beer not found' });
    }
    
    res.json({ message: 'Beer deleted successfully' });
  } catch (error) {
    console.error('Error deleting beer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 