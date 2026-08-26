-- One-time backfill of the 4 existing "Selected Work" entries as published
-- rows, so the carousel isn't empty between deploying this feature and the
-- owner adding real freelance projects through /admin/projects/.
--
-- Run this in the Supabase SQL Editor AFTER 0003_projects.sql.

insert into projects
  (slug, title, summary, engagement, tags, display_order, status, created_at)
values
  (
    'ecommerce-platforms-fexcon',
    'E-commerce Platforms — Fexcon',
    'Multiple production e-commerce platforms in Laravel, Zend, and React. RESTful APIs in PHP and Python supporting up to $2M monthly transaction volume, with five payment gateways integrated end to end — webhooks, checkout pipelines, and reconciliation.',
    'Fexcon',
    array['Laravel', 'React', 'Python', 'Payments', 'Docker'],
    1,
    'published',
    now()
  ),
  (
    'us-sports-nutrition-seo-revamp',
    'US Sports Nutrition Brand — SEO & Performance Revamp',
    'Full site revamp for a US-based sports nutrition brand focused on SEO and performance, growing organic traffic 150% within six months.',
    'Freelance',
    array['WordPress', 'SEO', 'Performance'],
    2,
    'published',
    now()
  ),
  (
    'biometric-attendance-system',
    'Biometric Attendance System',
    'IoT employee attendance system: ESP32 + FPM10A fingerprint sensor driven by a full state machine, with OLED display, 4x4 keypad, and admin PIN protection. Node.js/Express backend with SQLite.',
    'Freelance',
    array['IoT', 'ESP32', 'Node.js', 'Hardware'],
    3,
    'published',
    now()
  ),
  (
    'multi-cms-client-projects-webtechno',
    'Multi-CMS Client Projects — WebTechno',
    '100+ client projects delivered end to end across WordPress, Shopify, Wix, Squarespace, and GoDaddy — custom themes, plugins, and third-party API integrations for international clients.',
    'WebTechno',
    array['WordPress', 'Shopify', 'Wix', 'Squarespace'],
    4,
    'published',
    now()
  )
on conflict (slug) do nothing;
