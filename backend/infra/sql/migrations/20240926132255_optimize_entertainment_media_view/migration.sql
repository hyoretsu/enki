DROP VIEW "EntertainmentMedia";

CREATE MATERIALIZED VIEW "EntertainmentMedia" AS
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

CREATE OR REPLACE FUNCTION update_entertainment_media()
RETURNS TRIGGER AS $$
BEGIN
	REFRESH MATERIALIZED VIEW "EntertainmentMedia";

	RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER literary_work_refresh
AFTER INSERT OR UPDATE ON "LiteraryWork"
EXECUTE FUNCTION update_entertainment_media();

CREATE TRIGGER movie_refresh
AFTER INSERT OR UPDATE ON "Movie"
EXECUTE FUNCTION update_entertainment_media();

CREATE TRIGGER video_refresh
AFTER INSERT OR UPDATE ON "Video"
EXECUTE FUNCTION update_entertainment_media();

CREATE TRIGGER video_game_refresh
AFTER INSERT OR UPDATE ON "VideoGame"
EXECUTE FUNCTION update_entertainment_media();
