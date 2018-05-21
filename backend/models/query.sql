CREATE OR REPLACE FUNCTION is_overlapping
	(idd INT, s DATE, e DATE, ii INT, OUT result BOOLEAN)
	AS $$
BEGIN
	SELECT COUNT(*) = 0
	FROM "Bookings" b
	WHERE
		ii = b."ItemId"
		AND (
			(s >= b.start AND s < b.end)
		 	OR
		 	(e > b.start AND e <= b.end)
		 	OR
		 	(s < b.start AND e > b.end)
	 	)
	 	AND b.id != idd
	INTO result;
	RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION is_end_later_than_start
	(s DATE, e DATE, OUT result BOOLEAN)
	AS $$
BEGIN
	SELECT e - s > 0
	INTO result;
	RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION validity_check() RETURNS trigger AS $$
BEGIN
	IF(SELECT is_overlapping(NEW.id, NEW.start, NEW."end", NEW."ItemId") IS false) THEN
		RAISE EXCEPTION 'overlap';
	END IF;

	IF(SELECT is_end_later_than_start(NEW.start, NEW."end") IS false) THEN
		RAISE EXCEPTION 'error';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS validity_check ON "Bookings";
CREATE TRIGGER validity_check BEFORE INSERT OR UPDATE ON "Bookings"
	FOR EACH ROW
		EXECUTE PROCEDURE validity_check();



CREATE OR REPLACE FUNCTION set_search_data()
RETURNS trigger AS $$
BEGIN
  IF NEW.search_data IS NULL THEN
    NEW.search_data := (SELECT ARRAY(SELECT DISTINCT UNNEST(REGEXP_SPLIT_TO_ARRAY(LOWER(UNACCENT(CONCAT_WS(' ', i.name, i.email))), '(\s+|@|\-)')) FROM "Customers" i WHERE i.id = new."CustomerId"));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS set_search_data_trigger ON "Bookings";
CREATE TRIGGER set_search_data_trigger BEFORE INSERT ON "Bookings"
	FOR EACH ROW
		EXECUTE PROCEDURE set_search_data();



CREATE OR REPLACE FUNCTION set_simple_name()
RETURNS trigger AS $$
BEGIN
  IF NEW.simple_name IS NULL THEN
  	NEW.simple_name := UNACCENT(REPLACE(LOWER(NEW.name), ' ', ''));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';


DROP TRIGGER IF EXISTS set_simple_name_trigger ON "Customers";
CREATE TRIGGER set_simple_name_trigger BEFORE INSERT ON "Customers"
	FOR EACH ROW
		EXECUTE PROCEDURE set_simple_name();