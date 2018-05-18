CREATE OR REPLACE FUNCTION is_valid
	(s DATE, e DATE, ii INT, OUT result BOOLEAN)
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
	 INTO result;
	 RETURN;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION validity_check() RETURNS trigger AS $$
BEGIN
	IF(SELECT is_valid(NEW.start, NEW."end", NEW."ItemId") IS false) THEN
		RAISE EXCEPTION 'overlap';
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
    NEW.search_data := (SELECT ARRAY(SELECT DISTINCT UNNEST(REGEXP_SPLIT_TO_ARRAY(LOWER(UNACCENT(CONCAT_WS(' ', i.name, i.email))), '(\s+|@|\-|\.)')) FROM "Users" i WHERE i.id = new.id));
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


DROP TRIGGER IF EXISTS set_simple_name_trigger ON "Users";
CREATE TRIGGER set_simple_name_trigger BEFORE INSERT ON "Users"
	FOR EACH ROW
		EXECUTE PROCEDURE set_simple_name();