-- Create the database
SELECT 'CREATE DATABASE <db_name>'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chronos-db')\gexec

-- Connect to the new database
\c "chronos-db";
