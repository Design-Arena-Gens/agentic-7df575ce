DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cake_tags;
DELETE FROM cakes;

INSERT INTO cakes (id, name, description, price, image_url, featured, flavor)
VALUES
  (1, 'Classic Vanilla Cake', 'Light vanilla sponge with buttercream frosting.', 35.00, 'https://images.unsplash.com/photo-1542826438-30c9d1f1cf4d', true, 'Vanilla'),
  (2, 'Chocolate Fudge Cake', 'Rich chocolate cake with ganache layers.', 45.00, 'https://images.unsplash.com/photo-1599785209707-28b61cf1f470', true, 'Chocolate'),
  (3, 'Strawberry Delight', 'Fresh strawberries with whipped cream frosting.', 40.00, 'https://images.unsplash.com/photo-1464347744102-11db6282f854', false, 'Strawberry'),
  (4, 'Lemon Zest Cake', 'Tangy lemon cake with citrus glaze.', 32.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', false, 'Citrus'),
  (5, 'Red Velvet Cake', 'Classic red velvet with cream cheese frosting.', 38.00, 'https://images.unsplash.com/photo-1541767966073-69ad09fda2fe', true, 'Red Velvet');

INSERT INTO cake_tags (cake_id, tags) VALUES
  (1, 'best-seller'),
  (2, 'gluten-free'),
  (3, 'seasonal'),
  (4, 'citrus'),
  (5, 'featured');
ALTER TABLE cakes ALTER COLUMN id RESTART WITH 6;
