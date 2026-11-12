-- Record the existing LAN_hint.hint type change in migration history.
-- On databases where this column is already TEXT, mark this migration as applied.
-- On other databases, this widening conversion preserves existing values.
ALTER TABLE "public"."LAN_hint" ALTER COLUMN "hint" TYPE TEXT;
