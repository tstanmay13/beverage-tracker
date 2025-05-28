import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { CreateBeerDTO, UpdateBeerDTO } from '../types/beer';

const router = Router();

// Get all beers with search, filtering, and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search = '',
      minAbv = 0,
      maxAbv = 100,
      style_id,
      page = 1,
      limit = 12
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT * FROM beers 
      WHERE name ILIKE $1 
      AND abv >= $2 
      AND abv <= $3
    `;
    const queryParams = [`%${search}%`, minAbv, maxAbv];

    if (style_id) {
      query += ' AND style_id = $4';
      queryParams.push(style_id as string);
    }

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ' ORDER BY name ASC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit as string, offset.toString());

    const result = await pool.query(query, queryParams);
    
    res.json({
      beers: result.rows,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
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
    const {
      brewery_id,
      name,
      cat_id,
      style_id,
      abv,
      ibu,
      srm,
      upc,
      filepath,
      descript,
      add_user
    } = beer;
    
    const result = await pool.query(
      `INSERT INTO beers (
        brewery_id, name, cat_id, style_id, abv, ibu, srm, upc, filepath, descript, add_user
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [brewery_id, name, cat_id, style_id, abv, ibu, srm, upc, filepath, descript, add_user]
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
      `UPDATE beers SET ${setClause}, last_mod = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
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