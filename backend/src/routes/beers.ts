import { Router, Request, Response } from 'express';
import { pool } from '../index';
import { CreateBeerDTO, UpdateBeerDTO } from '../types/beer';
import crypto from 'crypto';

const router = Router();

// Helper function to generate a random ID
const generateId = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Get all beers with search, filtering, and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      search = '',
      minAbv = 0,
      maxAbv = 100,
      style_id,
      available_id,
      is_organic,
      is_retired,
      page = 1,
      limit = 12
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT b.*, s.name as style_name, g.name as glassware_name, a.name as availability_name
      FROM beers b
      LEFT JOIN styles s ON b.style_id = s.id
      LEFT JOIN glassware g ON b.glassware_id = g.id
      LEFT JOIN availability a ON b.available_id = a.id
      WHERE b.name ILIKE $1 
      AND (b.abv >= $2 OR b.abv IS NULL)
      AND (b.abv <= $3 OR b.abv IS NULL)
    `;
    const queryParams = [`%${search}%`, minAbv, maxAbv];

    if (style_id) {
      query += ' AND b.style_id = $' + (queryParams.length + 1);
      queryParams.push(style_id as string);
    }

    if (available_id) {
      query += ' AND b.available_id = $' + (queryParams.length + 1);
      queryParams.push(available_id as string);
    }

    if (is_organic !== undefined) {
      query += ' AND b.is_organic = $' + (queryParams.length + 1);
      queryParams.push(is_organic as string);
    }

    if (is_retired !== undefined) {
      query += ' AND b.is_retired = $' + (queryParams.length + 1);
      queryParams.push(is_retired as string);
    }

    // Get total count for pagination
    const countQuery = query.replace('SELECT b.*, s.name as style_name, g.name as glassware_name, a.name as availability_name', 'SELECT COUNT(*)');
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ' ORDER BY b.name ASC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
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
    const result = await pool.query(`
      SELECT b.*, s.name as style_name, g.name as glassware_name, a.name as availability_name
      FROM beers b
      LEFT JOIN styles s ON b.style_id = s.id
      LEFT JOIN glassware g ON b.glassware_id = g.id
      LEFT JOIN availability a ON b.available_id = a.id
      WHERE b.id = $1
    `, [id]);
    
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
      name,
      name_display,
      description,
      abv,
      ibu,
      srm,
      style_id,
      available_id,
      glassware_id,
      is_organic,
      is_retired,
      labels,
      status,
      status_display
    } = beer;
    
    const id = generateId();
    
    const result = await pool.query(
      `INSERT INTO beers (
        id, name, name_display, description, abv, ibu, srm, style_id,
        available_id, glassware_id, is_organic, is_retired, labels,
        status, status_display, create_date, update_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        id, name, name_display, description, abv, ibu, srm, style_id,
        available_id, glassware_id, is_organic, is_retired, labels,
        status, status_display
      ]
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
      `UPDATE beers SET ${setClause}, update_date = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
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