/*
  # Add registration helper functions

  1. Functions
    - `generate_id_pendaftaran()` - Generate registration ID with format RJ[YYYY][MM][DD][000X]
    - `generate_no_antrian()` - Generate queue number for current date
  
  2. Security
    - Functions are accessible to authenticated users
*/

-- Function to generate ID pendaftaran with format RJ[YYYY][MM][DD][000X]
CREATE OR REPLACE FUNCTION generate_id_pendaftaran()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  current_date_str text;
  next_number integer;
  result text;
BEGIN
  -- Get current date in YYYYMMDD format
  current_date_str := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get the next number for today
  SELECT COALESCE(MAX(CAST(RIGHT(id_pendaftaran, 3) AS integer)), 0) + 1
  INTO next_number
  FROM registrations
  WHERE id_pendaftaran LIKE 'RJ' || current_date_str || '%';
  
  -- Format the result
  result := 'RJ' || current_date_str || LPAD(next_number::text, 3, '0');
  
  RETURN result;
END;
$$;

-- Function to generate queue number for current date
CREATE OR REPLACE FUNCTION generate_no_antrian()
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  next_number integer;
BEGIN
  -- Get the next queue number for today
  SELECT COALESCE(MAX(no_antrian), 0) + 1
  INTO next_number
  FROM registrations
  WHERE tanggal = CURRENT_DATE;
  
  RETURN next_number;
END;
$$;