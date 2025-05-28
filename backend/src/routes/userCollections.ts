import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { CreateUserCollectionDTO, UpdateUserCollectionDTO } from '../types/userCollection';

const router = Router();

// Get all beers in a user's collection
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT uc.*, b.* FROM user_collections uc JOIN beers b ON uc.beer_id = b.id WHERE uc.user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a beer to user's collection
router.post('/', async (req: Request, res: Response) => {
  try {
    const collection: CreateUserCollectionDTO = req.body;
    const { user_id, beer_id, rating, notes } = collection;
    const result = await pool.query(
      'INSERT INTO user_collections (user_id, beer_id, rating, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, beer_id, rating, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding beer to collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a beer in user's collection
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateUserCollectionDTO = req.body;
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = Object.values(updates);
    const result = await pool.query(
      `UPDATE user_collections SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collection entry not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating collection entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a beer from user's collection
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM user_collections WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collection entry not found' });
    }
    res.json({ message: 'Beer removed from collection successfully' });
  } catch (error) {
    console.error('Error removing beer from collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 