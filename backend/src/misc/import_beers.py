import os
import json
import psycopg2
from psycopg2.extras import execute_values

# Database connection parameters
DB_PARAMS = {
    'dbname': 'beer_tracker',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

# Path to the beer-database directory containing JSON files
BEER_DB_DIR = '../beer-database'

def connect_db():
    return psycopg2.connect(**DB_PARAMS)

def insert_categories(conn, categories):
    with conn.cursor() as cur:
        execute_values(cur, """
            INSERT INTO categories (id, name, create_date)
            VALUES %s
            ON CONFLICT (id) DO NOTHING
        """, categories)

def insert_styles(conn, styles):
    with conn.cursor() as cur:
        execute_values(cur, """
            INSERT INTO styles (id, category_id, name, short_name, description, ibu_min, ibu_max, abv_min, abv_max, srm_min, srm_max, og_min, fg_min, fg_max, create_date, update_date)
            VALUES %s
            ON CONFLICT (id) DO NOTHING
        """, styles)

def insert_glassware(conn, glassware):
    with conn.cursor() as cur:
        execute_values(cur, """
            INSERT INTO glassware (id, name, create_date)
            VALUES %s
            ON CONFLICT (id) DO NOTHING
        """, glassware)

def insert_availability(conn, availability):
    with conn.cursor() as cur:
        execute_values(cur, """
            INSERT INTO availability (id, name, description)
            VALUES %s
            ON CONFLICT (id) DO NOTHING
        """, availability)

def insert_beers(conn, beers):
    with conn.cursor() as cur:
        execute_values(cur, """
            INSERT INTO beers (id, name, name_display, description, abv, ibu, srm, style_id, available_id, glassware_id, is_organic, is_retired, labels, status, status_display, create_date, update_date)
            VALUES %s
            ON CONFLICT (id) DO NOTHING
        """, beers)

def process_json_file(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    categories = []
    styles = []
    glassware = []
    availability = []
    beers = []
    
    for beer in data.get('data', []):
        # Extract category data
        if 'style' in beer and 'category' in beer['style']:
            cat = beer['style']['category']
            categories.append((cat['id'], cat['name'], cat.get('createDate')))
        
        # Extract style data
        if 'style' in beer:
            style = beer['style']
            styles.append((
                style['id'],
                style.get('categoryId'),
                style['name'],
                style.get('shortName'),
                style.get('description'),
                style.get('ibuMin'),
                style.get('ibuMax'),
                style.get('abvMin'),
                style.get('abvMax'),
                style.get('srmMin'),
                style.get('srmMax'),
                style.get('ogMin'),
                style.get('fgMin'),
                style.get('fgMax'),
                style.get('createDate'),
                style.get('updateDate')
            ))
        
        # Extract glassware data
        if 'glass' in beer:
            glass = beer['glass']
            glassware.append((glass['id'], glass['name'], glass.get('createDate')))
        
        # Extract availability data
        if 'available' in beer:
            avail = beer['available']
            availability.append((avail['id'], avail['name'], avail.get('description')))
        
        # Extract beer data
        labels = beer.get('labels', {})
        labels_str = json.dumps(labels) if not isinstance(labels, str) else labels
        srm = beer.get('srm')
        if isinstance(srm, dict):
            # Prefer 'id' if numeric, else 'name', else None
            srm_val = srm.get('id')
            if isinstance(srm_val, (int, float, str)) and str(srm_val).replace('.', '', 1).isdigit():
                srm = float(srm_val)
            else:
                srm = srm.get('name')
                try:
                    srm = float(srm)
                except (TypeError, ValueError):
                    srm = None
        beer_tuple = (
            beer['id'],
            beer['name'],
            beer.get('nameDisplay'),
            beer.get('description'),
            beer.get('abv'),
            beer.get('ibu'),
            srm,
            beer.get('styleId'),
            beer.get('availableId'),
            beer.get('glasswareId'),
            beer.get('isOrganic') == 'Y',
            beer.get('isRetired') == 'Y',
            labels_str,
            beer.get('status'),
            beer.get('statusDisplay'),
            beer.get('createDate'),
            beer.get('updateDate')
        )
        beers.append(beer_tuple)
    
    return categories, styles, glassware, availability, beers

def main():
    conn = connect_db()
    try:
        for filename in os.listdir(BEER_DB_DIR):
            if filename.endswith('.json'):
                file_path = os.path.join(BEER_DB_DIR, filename)
                print(f"Processing {filename}...")
                categories, styles, glassware, availability, beers = process_json_file(file_path)
                
                insert_categories(conn, categories)
                insert_styles(conn, styles)
                insert_glassware(conn, glassware)
                insert_availability(conn, availability)
                insert_beers(conn, beers)
                
                conn.commit()
                print(f"Imported data from {filename}")
    finally:
        conn.close()

if __name__ == '__main__':
    main() 