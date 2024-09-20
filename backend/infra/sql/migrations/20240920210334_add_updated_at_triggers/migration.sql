CREATE OR REPLACE FUNCTION updated_at() RETURNS TRIGGER AS
$$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER literary_work_updated_at
BEFORE UPDATE ON "LiteraryWork"
FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TRIGGER literary_work_chapter_updated_at
BEFORE UPDATE ON "LiteraryWorkChapter"
FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TRIGGER movie_updated_at
BEFORE UPDATE ON "Movie"
FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TRIGGER user_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TRIGGER video_updated_at
BEFORE UPDATE ON "Video"
FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TRIGGER video_channel_updated_at
BEFORE UPDATE ON "VideoChannel"
FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TRIGGER video_playlist_updated_at
BEFORE UPDATE ON "VideoPlaylist"
FOR EACH ROW EXECUTE FUNCTION updated_at();






