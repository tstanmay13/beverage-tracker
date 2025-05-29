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