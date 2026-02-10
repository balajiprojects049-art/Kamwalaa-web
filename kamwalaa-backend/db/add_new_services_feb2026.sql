-- SQL Script to add new 'Interior Design' and 'Construction Services' to the backend
-- Run this script in your PostgreSQL database to enable booking for these new services.

BEGIN;

-----------------------------------------------------------
-- 1. ADD 'INTERIOR DESIGN' CATEGORY HIERARCHY
-----------------------------------------------------------

-- Root Category: Interior Design
INSERT INTO categories (name, slug, description, icon_url, display_order, is_active)
VALUES (
    'Interior Design', 
    'interior', 
    'Transform your space with our premium interior design and execution services.', 
    '/icons/interior.svg', 
    10, 
    true
) ON CONFLICT (slug) DO NOTHING;

-- Subcategory: Woodwork & Carpentry
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Woodwork & Carpentry', 'woodwork', 'Custom woodwork and carpentry services', id, 1
FROM categories WHERE slug = 'interior'
ON CONFLICT (slug) DO NOTHING;

-- Services for Woodwork & Carpentry
INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Modular Kitchen', 'modular-kitchen', 'Custom designed modular kitchens with premium finish and ergonomic layout.', 0.00, '/assets/images/services/interior/modular-kitchen.png', true
FROM categories WHERE slug = 'woodwork'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Wardrobe Design', 'wardrobe-design', 'Space-saving and stylish wardrobe designs customized for your bedroom.', 0.00, '/assets/images/services/interior/wardrobe-design.png', true
FROM categories WHERE slug = 'woodwork'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'TV Unit Design', 'tv-unit', 'Modern and elegant TV units to enhance your living room aesthetics.', 0.00, '/assets/images/services/interior/tv-unit.png', true
FROM categories WHERE slug = 'woodwork'
ON CONFLICT (slug) DO NOTHING;


-- Subcategory: False Ceiling & POP
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'False Ceiling & POP', 'ceiling-work', 'False ceiling and POP design services', id, 2
FROM categories WHERE slug = 'interior'
ON CONFLICT (slug) DO NOTHING;

-- Services for False Ceiling & POP
INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Gypsum False Ceiling', 'gypsum-ceiling', 'Premium gypsum false ceiling with insulation properties.', 95.00, '/assets/images/services/interior/gypsum-ceiling.png', true
FROM categories WHERE slug = 'ceiling-work'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'POP Design Works', 'pop-design', 'Cornices, mouldings, and decorative centerpieces using high-quality Plaster of Paris.', 0.00, '/assets/images/services/interior/pop-design.png', true
FROM categories WHERE slug = 'ceiling-work'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Grid Ceiling', 'grid-ceiling', 'Modular grid ceiling ideal for offices and commercial spaces.', 75.00, '/assets/images/services/interior/grid-ceiling.png', true
FROM categories WHERE slug = 'ceiling-work'
ON CONFLICT (slug) DO NOTHING;


-- Subcategory: Wall Decor & Aesthetics
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Wall Decor & Aesthetics', 'wall-decor', 'Wall decoration and aesthetic services', id, 3
FROM categories WHERE slug = 'interior'
ON CONFLICT (slug) DO NOTHING;

-- Services for Wall Decor
INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Wall Paneling', 'wall-paneling', 'Luxurious wooden, PVC, or fabric wall paneling.', 0.00, '/assets/images/services/interior/wall-paneling.png', true
FROM categories WHERE slug = 'wall-decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Glass Partitions', 'glass-partition', 'Toughened glass partitions for offices and homes.', 0.00, '/assets/images/services/interior/glass-partition.png', true
FROM categories WHERE slug = 'wall-decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Wallpaper Installation', 'wallpaper', 'Professional installation of premium wallpapers.', 35.00, '/assets/images/services/interior/wallpaper.png', true
FROM categories WHERE slug = 'wall-decor'
ON CONFLICT (slug) DO NOTHING;


-----------------------------------------------------------
-- 2. ADD 'CONSTRUCTION SERVICES' CATEGORY HIERARCHY
-----------------------------------------------------------

-- Root Category: Construction Services
INSERT INTO categories (name, slug, description, icon_url, display_order, is_active)
VALUES (
    'Construction Services', 
    'construction', 
    'End-to-end construction and civil work services for residential and commercial properties.', 
    '/icons/construction.svg', 
    11, 
    true
) ON CONFLICT (slug) DO NOTHING;

-- Subcategory: Civil Works
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Civil Works', 'civil-work', 'General civil construction works', id, 1
FROM categories WHERE slug = 'construction'
ON CONFLICT (slug) DO NOTHING;

-- Services for Civil Works
INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'New Home Construction', 'new-construction', 'Complete home construction packages from foundation to finish.', 0.00, '/assets/images/services/construction/new-construction.png', true
FROM categories WHERE slug = 'civil-work'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Renovation Services', 'renovation', 'Partial or full home renovation services.', 0.00, '/assets/images/services/construction/renovation.png', true
FROM categories WHERE slug = 'civil-work'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Bathroom Renovation', 'bathroom-reno', 'Modernizing bathrooms with new tiles, fittings, and plumbing.', 0.00, '/assets/images/services/construction/bathroom-reno.png', true
FROM categories WHERE slug = 'civil-work'
ON CONFLICT (slug) DO NOTHING;


-- Subcategory: Structural & Masonry
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Structural & Masonry', 'structural', 'Structural and masonry works', id, 2
FROM categories WHERE slug = 'construction'
ON CONFLICT (slug) DO NOTHING;

-- Services for Structural & Masonry
INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Foundation Work', 'foundation', 'Strong and durable foundation work including excavation and PCC.', 0.00, '/assets/images/services/construction/foundation.png', true
FROM categories WHERE slug = 'structural'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Brick & Block Work', 'brick-work', 'High-quality brick or block masonry for walls and partitions.', 0.00, '/assets/images/services/construction/brick-work.png', true
FROM categories WHERE slug = 'structural'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Plastering', 'plastering', 'Smooth internal and external wall plastering with curing.', 0.00, '/assets/images/services/construction/plastering.png', true
FROM categories WHERE slug = 'structural'
ON CONFLICT (slug) DO NOTHING;


-- Subcategory: Fabrication Works
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Fabrication Works', 'fabrication', 'Metal fabrication works', id, 3
FROM categories WHERE slug = 'construction'
ON CONFLICT (slug) DO NOTHING;

-- Services for Fabrication Works
INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Grills & Gates', 'grills-gates', 'Custom design and installation of safety grills and main gates.', 0.00, '/assets/images/services/construction/grills-gates.png', true
FROM categories WHERE slug = 'fabrication'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (category_id, name, slug, description, price, image_url, is_active)
SELECT id, 'Shed Construction', 'shed-work', 'Roofing and shed construction using metal or polycarbonate sheets.', 0.00, '/assets/images/services/construction/shed-work.png', true
FROM categories WHERE slug = 'fabrication'
ON CONFLICT (slug) DO NOTHING;

COMMIT;
