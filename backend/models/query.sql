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



CREATE OR REPLACE FUNCTION move_up(tablename TEXT, moveid INTEGER) RETURNS VOID AS $$
BEGIN
	EXECUTE 'UPDATE ' || quote_ident(tablename) || ' c
	SET "order" =
		CASE c."order"
			WHEN x."order" THEN x."order" - 1
			WHEN x."order" - 1 THEN x."order"
		END
	FROM (SELECT id, "order"
		FROM ' || quote_ident(tablename) || '
		WHERE id = $1
		AND "order" > 1) x
	WHERE c."order" = x."order" OR c."order" = x."order" - 1' USING moveid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION move_down(tablename TEXT, moveid INTEGER) RETURNS VOID AS $$
BEGIN
	EXECUTE 'UPDATE ' || quote_ident(tablename) || ' c
	SET "order" =
		CASE c."order"
			WHEN x."order" THEN x."order" + 1
			WHEN x."order" + 1 THEN x."order"
		END
	FROM (SELECT id, "order"
		FROM ' || quote_ident(tablename) || '
		WHERE id = $1
		AND "order" < (SELECT MAX("order") FROM ' || quote_ident(tablename) || ')) x
	WHERE c."order" = x."order" OR c."order" = x."order" + 1' USING moveid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION move_to(tablename TEXT, moveid INTEGER, toposition INTEGER) RETURNS VOID AS $$
DECLARE
	max INTEGER;
BEGIN
	EXECUTE 'SELECT MAX("order") FROM ' || quote_ident(tablename) INTO max;

	IF toposition >= 1 AND toposition <= max THEN
		EXECUTE 'UPDATE ' || quote_ident(tablename) || ' c
		SET "order" = CASE
			WHEN c."order" = x."order" THEN $2
			WHEN x."order" < $2 THEN c."order" - 1
			ELSE c."order" + 1
		END
		FROM (
			SELECT "order"
			FROM ' || quote_ident(tablename) || '
			WHERE id = $1
		) x
		WHERE
			CASE WHEN x."order" < 2 THEN
				c."order" >= x."order" AND c."order" <= $2
			ELSE
				c."order" <= x."order" AND c."order" >= $2
			END' USING moveid, toposition;
	END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_order() RETURNS TRIGGER AS $$
DECLARE
	val INTEGER;
BEGIN
	IF NEW."order" IS NULL THEN
		EXECUTE 'SELECT COALESCE(MAX("order") + 1, 1) AS "order" FROM ' || quote_ident(TG_ARGV[0]) INTO val;
		NEW."order" := val;
	END IF;
	
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_trigger ON "Items";
CREATE TRIGGER set_order_trigger BEFORE INSERT ON "Items"
	FOR EACH ROW
		EXECUTE PROCEDURE set_order("Items");