CREATE OR REPLACE FUNCTION is_valid
	(s DATE, e DATE, OUT result BOOLEAN)
	AS $$
BEGIN
	SELECT COUNT(*) = 0
	FROM "Bookings" b
	WHERE
		(s >= b.start AND s < b.end)
	 	OR
	 	(e > b.start AND e <= b.end)
	 	OR
	 	(s < b.start AND e > b.end)
	 INTO result;
	 RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validity_check() RETURNS trigger AS $$
BEGIN
	IF(SELECT is_valid(NEW.start, NEW."end") IS false) THEN
		RAISE EXCEPTION 'overlap';
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validity_check ON "Bookings";
CREATE TRIGGER validity_check BEFORE INSERT OR UPDATE ON "Bookings"
	FOR EACH ROW EXECUTE PROCEDURE validity_check();