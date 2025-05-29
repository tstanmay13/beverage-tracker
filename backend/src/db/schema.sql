-- New schema for beer database migration

CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    create_date TIMESTAMP
);

CREATE TABLE styles (
    id INTEGER PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(255),
    description TEXT,
    ibu_min FLOAT,
    ibu_max FLOAT,
    abv_min FLOAT,
    abv_max FLOAT,
    srm_min FLOAT,
    srm_max FLOAT,
    og_min FLOAT,
    fg_min FLOAT,
    fg_max FLOAT,
    create_date TIMESTAMP,
    update_date TIMESTAMP
);

CREATE TABLE glassware (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    create_date TIMESTAMP
);

CREATE TABLE availability (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE beers (
    id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_display VARCHAR(255),
    description TEXT,
    abv FLOAT,
    ibu FLOAT,
    srm FLOAT,
    style_id INTEGER REFERENCES styles(id),
    available_id INTEGER REFERENCES availability(id),
    glassware_id INTEGER REFERENCES glassware(id),
    is_organic BOOLEAN,
    is_retired BOOLEAN,
    labels JSONB,
    status VARCHAR(64),
    status_display VARCHAR(64),
    create_date TIMESTAMP,
    update_date TIMESTAMP
);

-- Create user_collections table
CREATE TABLE IF NOT EXISTS user_collections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    beer_id VARCHAR(16) NOT NULL,
    rating FLOAT CHECK (rating >= 0 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, beer_id),
    FOREIGN KEY (beer_id) REFERENCES beers(id) ON DELETE CASCADE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_collections_beer_id ON user_collections(beer_id);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_collections_updated_at
    BEFORE UPDATE ON user_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 