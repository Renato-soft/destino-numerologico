ALTER TABLE public.photos DROP CONSTRAINT photos_type_check;
ALTER TABLE public.photos ADD CONSTRAINT photos_type_check CHECK (type ~ '^(face|full_front|full_side|extra_.+)$');