-- =============================================================================
-- CHAKRA Multi-Vendor Marketplace - Seed Data & Initial Setup
-- =============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, description, icon, commission_rate_percent) VALUES
('ebooks', 'eBooks & PDF Books', 'Original non-fiction, creator playbooks, and research publications.', 'BookOpen', 10.00),
('storybooks', 'Story Books & Literature', 'Regional and English literature, Marathi epics, and illustrated tales.', 'BookMarked', 10.00),
('education', 'Educational & Exam Notes', 'UPSC, MPSC, and competitive examination handwritten mindmaps.', 'GraduationCap', 8.00),
('templates', 'Templates & Graphics', 'Production Figma kits, SaaS design systems, and automated spreadsheets.', 'Layout', 10.00),
('courses', 'Courses & Video Kits', 'Step-by-step masterclasses with project repos and video lessons.', 'Video', 12.00),
('software', 'Software & Boilerplates', 'Next.js boilers, developer starter repositories, and plugins.', 'Code', 10.00),
('artisan_crafts', 'Artisan & Brass Crafts', 'Authentic solid brass Diyas and sacred chakra metalcrafts.', 'Flame', 10.00),
('physical_goods', 'Physical Goods', 'Mulberry silk stationery, handmade journals, and heritage goods.', 'Package', 10.00)
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
description = EXCLUDED.description;

-- =============================================================================
-- FIRST ADMIN SETUP PROCEDURE:
-- To assign yourself as the root administrator:
-- 1. Sign up on your deployed CHAKRA marketplace via Supabase Auth with your email.
-- 2. Open Supabase Dashboard -> SQL Editor.
-- 3. Run the following query replacing 'your-email@example.com' with your account email:
--
-- UPDATE public.profiles
-- SET roles = ARRAY['buyer'::user_role_enum, 'seller'::user_role_enum, 'affiliate'::user_role_enum, 'admin'::user_role_enum]
-- WHERE email = 'your-email@example.com';
-- =============================================================================
