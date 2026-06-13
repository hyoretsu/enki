CREATE OR REPLACE FUNCTION get_media_info(media TEXT)
    RETURNS TABLE
            (
                "id"          BIGINT,
                "title"       JSONB,
                "releaseDate" DATE,
				"category"   TEXT,
                "createdAt"   TIMESTAMP,
                "updatedAt"   TIMESTAMP
            )
AS
$$
BEGIN
    RETURN QUERY EXECUTE FORMAT(
		'SELECT id, title, "releaseDate", %L AS "category", "createdAt", "updatedAt" FROM public.%I',
		LOWER(REGEXP_REPLACE(media, '(?<!^)([A-Z])', '_\1', 'g')),
		media
	);
END;
$$ LANGUAGE plpgsql;

CREATE VIEW "EntertainmentMedia" AS
SELECT *
FROM (
	SELECT * FROM get_media_info('LiteraryWork')
	UNION ALL
	SELECT * FROM get_media_info('Movie')
    UNION ALL
    SELECT * FROM get_media_info('Video')
    UNION ALL
	SELECT * FROM get_media_info('VideoGame')
);
