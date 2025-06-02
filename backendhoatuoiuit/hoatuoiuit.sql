-- Tạo database
DROP DATABASE IF EXISTS hoatuoiuit;
CREATE DATABASE hoatuoiuit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hoatuoiuit;

-- Xóa các bảng nếu tồn tại
DROP TABLE IF EXISTS order_product;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS product_discount;
DROP TABLE IF EXISTS product_occasion;
DROP TABLE IF EXISTS product_flower;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS occasion;
DROP TABLE IF EXISTS flowers;
DROP TABLE IF EXISTS categories;


SELECT * FROM customers;
SELECT * FROM products;

-- Tạo bảng flowers
CREATE TABLE flowers (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                         description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                         is_active BOOLEAN NOT NULL DEFAULT TRUE,
                         INDEX idx_name (name),
                         INDEX idx_is_active (is_active),
                         CONSTRAINT unique_name UNIQUE (name)
);

-- Tạo bảng occasion
CREATE TABLE occasion (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                          description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                          image_url VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                          is_active BOOLEAN NOT NULL DEFAULT TRUE,
                          INDEX idx_name (name),
                          INDEX idx_is_active (is_active),
                          CONSTRAINT unique_name UNIQUE (name)
);

-- Tạo bảng categories
CREATE TABLE categories (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                            description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                            is_active BOOLEAN NOT NULL DEFAULT TRUE,
                            INDEX idx_name (name),
                            INDEX idx_is_active (is_active),
                            CONSTRAINT unique_name UNIQUE (name)
);

-- Tạo bảng payments
CREATE TABLE payments (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          payment_name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                          description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                          is_active BOOLEAN NOT NULL DEFAULT TRUE,
                          INDEX idx_payment_name (payment_name),
                          INDEX idx_is_active (is_active),
                          CONSTRAINT unique_payment_name UNIQUE (payment_name)
);


-- Tạo bảng customers
CREATE TABLE customers (
                           id INT PRIMARY KEY AUTO_INCREMENT,
                           name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                           email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                           phone VARCHAR(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                           address VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                           password_hash VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                           is_active BOOLEAN NOT NULL DEFAULT TRUE,
                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                           role VARCHAR(20) NOT NULL DEFAULT 'USER',
                           INDEX idx_email (email),
                           INDEX idx_phone (phone),
                           INDEX idx_is_active (is_active),
                           CONSTRAINT unique_email UNIQUE (email),
                           CONSTRAINT unique_phone UNIQUE (phone)
);

-- Tạo bảng products
CREATE TABLE products (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                          description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                          price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
                          image_url VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                          category_id INT,
                          is_active BOOLEAN NOT NULL DEFAULT TRUE,
                          is_featured BOOLEAN NOT NULL DEFAULT FALSE,
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
                          INDEX idx_name (name),
                          INDEX idx_is_active (is_active),
                          INDEX idx_category_id (category_id),
                          INDEX idx_is_featured (is_featured),
                          INDEX idx_price (price)
);

-- Tạo bảng promotions
CREATE TABLE promotions (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            code VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                            discount_value DECIMAL(5,2) NOT NULL CHECK (discount_value >= 0),
                            description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                            start_date DATETIME NOT NULL,
                            end_date DATETIME NOT NULL,
                            is_active BOOLEAN NOT NULL DEFAULT TRUE,
                            INDEX idx_code (code),
                            INDEX idx_dates (start_date, end_date),
                            INDEX idx_is_active (is_active),
                            CONSTRAINT unique_code UNIQUE (code),
                            CONSTRAINT check_dates CHECK (start_date < end_date)
);

-- Tạo bảng product_flower
CREATE TABLE product_flower (
                                product_id INT,
                                flower_id INT,
                                PRIMARY KEY (product_id, flower_id),
                                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                                FOREIGN KEY (flower_id) REFERENCES flowers(id) ON DELETE CASCADE,
                                INDEX idx_flower_id (flower_id)
);

-- Tạo bảng product_occasion
CREATE TABLE product_occasion (
                                  product_id INT,
                                  occasion_id INT,
                                  PRIMARY KEY (product_id, occasion_id),
                                  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                                  FOREIGN KEY (occasion_id) REFERENCES occasion(id) ON DELETE CASCADE,
                                  INDEX idx_occasion_id (occasion_id)
);

-- Tạo bảng product_discount
CREATE TABLE product_discount (
                                  product_id INT,
                                  discount_id INT,
                                  PRIMARY KEY (product_id, discount_id),
                                  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                                  FOREIGN KEY (discount_id) REFERENCES promotions(id) ON DELETE CASCADE,
                                  INDEX idx_discount_id (discount_id)
);

-- Tạo bảng reviews
CREATE TABLE reviews (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         customer_id INT,
                         product_id INT,
                         rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                         comment TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                         is_verified BOOLEAN NOT NULL DEFAULT FALSE,
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                         FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                         INDEX idx_customer_id (customer_id),
                         INDEX idx_product_id (product_id),
                         INDEX idx_rating (rating)
);

-- Tạo bảng orders
CREATE TABLE orders (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        customer_id INT,
                        order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        delivery_date DATETIME,
                        delivery_address VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                        total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
                        status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
                        payment_id INT,
                        note TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                        FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
                        INDEX idx_customer_id (customer_id),
                        INDEX idx_payment_id (payment_id),
                        INDEX idx_status (status),
                        INDEX idx_order_date (order_date)
);

-- Tạo bảng order_product
CREATE TABLE order_product (
                               id INT PRIMARY KEY AUTO_INCREMENT,
                               order_id INT,
                               product_id INT,
                               quantity INT NOT NULL CHECK (quantity > 0),
                               price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
                               discount_applied DECIMAL(10,2) DEFAULT 0.00,
                               FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                               FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                               INDEX idx_order_id (order_id),
                               INDEX idx_product_id (product_id)
);

-- Tạo bảng cart
CREATE TABLE cart (
                      id INT PRIMARY KEY AUTO_INCREMENT,
                      customer_id INT,
                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                      INDEX idx_customer_id (customer_id)
);

-- Tạo bảng cart_items
CREATE TABLE cart_items (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            cart_id INT,
                            product_id INT,
                            quantity INT NOT NULL CHECK (quantity > 0),
                            FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
                            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                            INDEX idx_cart_id (cart_id),
                            INDEX idx_product_id (product_id)
);

-- Tạo bảng wishlist
CREATE TABLE wishlist (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          customer_id INT NOT NULL,
                          product_id INT NOT NULL,
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                          UNIQUE KEY unique_wishlist_item (customer_id, product_id),
                          INDEX idx_customer_id (customer_id),
                          INDEX idx_product_id (product_id)
);



INSERT INTO flowers (name, description, is_active) VALUES
                                                       ('Hoa hồng', 'Hoa hồng đỏ tượng trưng cho tình yêu và sự lãng mạn.', TRUE),
                                                       ('Hoa cúc', 'Hoa cúc trắng biểu tượng của sự tinh khiết và ngây thơ.', TRUE),
                                                       ('Hoa lan', 'Hoa lan tím thể hiện sự sang trọng và quý phái.', TRUE),
                                                       ('Hoa tulip', 'Hoa tulip vàng mang ý nghĩa niềm vui và hạnh phúc.', FALSE);


INSERT INTO occasion (name, description, image_url, is_active) VALUES
                                                                   ('Sinh nhật', 'Hoa cho dịp sinh nhật, rực rỡ và vui tươi.', '/uploads/8139ed07-a47e-4bdd-8004-b78e7c781e48.webp', TRUE),
                                                                   ('Lễ cưới', 'Hoa trang trí cho lễ cưới, sang trọng và tinh tế.', '/uploads/5509837f-bc75-4eaa-8845-4406a4f021ea.webp', TRUE),
                                                                   ('Chúc mừng', 'Hoa chúc mừng thành công và hạnh phúc.', '/uploads/9927c4fe-c90e-4ef5-8401-e7020b194d67.webp', TRUE),
                                                                   ('Tang lễ', 'Hoa chia buồn, trang trọng và thanh lịch.', '/uploads/27e510c3-3097-48e7-9b2f-ea1345882739.webp', FALSE);

INSERT INTO categories (name, description, is_active) VALUES
                                                          ('Bó hoa', 'Các bó hoa được thiết kế tinh tế.', TRUE),
                                                          ('Lẵng hoa', 'Lẵng hoa trang trí cho các sự kiện.', TRUE),
                                                          ('Hoa cưới', 'Hoa cầm tay cô dâu và trang trí cưới.', TRUE),
                                                          ('Hoa sự kiện', 'Hoa trang trí cho các sự kiện lớn.', FALSE);

INSERT INTO payments (payment_name, description, is_active) VALUES
                                                                ('Tiền mặt', 'Thanh toán bằng tiền mặt khi nhận hàng.', TRUE),
                                                                ('Chuyển khoản', 'Thanh toán qua chuyển khoản ngân hàng.', TRUE),
                                                                ('Thẻ tín dụng', 'Thanh toán bằng thẻ Visa/Mastercard.', TRUE),
                                                                ('Ví điện tử', 'Thanh toán qua Momo/ZaloPay.', FALSE);


INSERT INTO products (name, description, price, image_url, category_id, is_active, is_featured) VALUES
                                                                                                    ('Bó hoa hồng đỏ', 'Bó hoa hồng đỏ 20 bông, lãng mạn.', 250000.00, '/uploads/9232a1b5-31e1-4de5-b3cd-123fedf7c3ee.webp', 1, TRUE, TRUE),
                                                                                                    ('Lẵng hoa cúc trắng', 'Lẵng hoa cúc trắng tinh khôi.', 350000.00, '/uploads/828a97c5-3e07-4b1f-9557-0167d4d97de6.webp', 2, TRUE, FALSE),
                                                                                                    ('Bó hoa hồng tím', 'Bó hoa hồng tông tím', 500000.00, '/uploads/7ea4d7f7-b00c-4d18-b85f-1626c65be791.webp', 3, TRUE, TRUE),
                                                                                                    ('Bó hoa tulip', 'Bó hoa tulip hồng rực rỡ.', 200000.00, '/uploads/59fb8ee3-de0e-4bde-9611-ff3de4b2773d.webp', 1, FALSE, FALSE);

INSERT INTO promotions (code, discount_value, description, start_date, end_date, is_active) VALUES
                                                                                                ('SUMMER2023', 10.00, 'Giảm giá 10% cho mùa hè.', '2023-06-01 00:00:00', '2023-08-31 23:59:59', TRUE),
                                                                                                ('NEWYEAR2024', 15.00, 'Giảm giá 15% dịp năm mới.', '2024-01-01 00:00:00', '2024-01-15 23:59:59', TRUE),
                                                                                                ('BLACKFRIDAY', 20.00, 'Giảm giá 20% Black Friday.', '2023-11-24 00:00:00', '2023-11-30 23:59:59', FALSE),
                                                                                                ('WELCOME10', 5.00, 'Giảm giá 5% cho khách hàng mới.', '2023-01-01 00:00:00', '2023-12-31 23:59:59', TRUE);

INSERT INTO product_flower (product_id, flower_id) VALUES
                                                       (1, 1), -- Bó hoa hồng đỏ chứa hoa hồng
                                                       (2, 2), -- Lẵng hoa cúc trắng chứa hoa cúc
                                                       (3, 3), -- Hoa cưới lan tím chứa hoa lan
                                                       (4, 4); -- Bó hoa tulip vàng chứa hoa tulip

INSERT INTO product_occasion (product_id, occasion_id) VALUES
                                                           (1, 1), -- Bó hoa hồng đỏ cho Sinh nhật
                                                           (1, 2), -- Bó hoa hồng đỏ cho Lễ cưới
                                                           (2, 3), -- Lẵng hoa cúc trắng cho Chúc mừng
                                                           (3, 2), -- Hoa cưới lan tím cho Lễ cưới
                                                           (4, 1); -- Bó hoa tulip vàng cho Sinh nhật

INSERT INTO product_discount (product_id, discount_id) VALUES
                                                           (1, 1), -- Bó hoa hồng đỏ áp dụng SUMMER2023
                                                           (2, 2), -- Lẵng hoa cúc trắng áp dụng NEWYEAR2024
                                                           (3, 3), -- Hoa cưới lan tím áp dụng BLACKFRIDAY
                                                           (4, 4); -- Bó hoa tulip vàng áp dụng WELCOME10

INSERT INTO reviews (customer_id, product_id, rating, comment, is_verified) VALUES
                                                                                (1, 1, 5, 'Bó hoa rất đẹp, giao hàng đúng giờ!', TRUE),
                                                                                (2, 2, 4, 'Lẵng hoa cúc trắng rất tinh tế.', FALSE),
                                                                                (3, 3, 3, 'Hoa lan đẹp nhưng giá hơi cao.', TRUE),
                                                                                (4, 4, 2, 'Hoa tulip không tươi như kỳ vọng.', FALSE);

INSERT INTO orders (customer_id, order_date, delivery_date, delivery_address, total_amount, status, payment_id, note) VALUES
                                                                                                                          (1, '2025-5-7 10:00:00', '2025-5-9 14:00:00', '123 Đường Hoa Sen, TP.HCM', 500000.00, 'PENDING', 1, 'Giao trong giờ hành chính'),
                                                                                                                          (2, '2025-5-5 12:00:00', '2025-5-7 16:00:00', '456 Đường Hoa Cúc, Hà Nội', 350000.00, 'PROCESSING', 2, NULL),
                                                                                                                          (3, '2025-5-5 14:00:00', '2025-5-6 10:00:00', '789 Đường Hoa Mai, Đà Nẵng', 700000.00, 'SHIPPED', 3, 'Gói quà cẩn thận'),
                                                                                                                          (4, '2025-5-1 16:00:00', NULL, '101 Đường Hoa Hồng, Cần Thơ', 200000.00, 'CANCELLED', NULL, 'Hủy do khách đổi ý');

INSERT INTO order_product (order_id, product_id, quantity, price, discount_applied) VALUES
                                                                                        (1, 1, 2, 250000.00, 25000.00), -- Đơn 1: 2 bó hoa hồng đỏ, giảm 10%
                                                                                        (2, 2, 1, 350000.00, 0.00), -- Đơn 2: 1 lẵng hoa cúc trắng
                                                                                        (3, 3, 1, 500000.00, 100000.00), -- Đơn 3: 1 hoa cưới lan tím, giảm 20%
                                                                                        (4, 4, 1, 200000.00, 0.00); -- Đơn 4: 1 bó hoa tulip vàng

INSERT INTO cart (customer_id) VALUES
                                   (1), -- Giỏ hàng của Nguyễn Văn A
                                   (2), -- Giỏ hàng của Trần Thị B
                                   (3); -- Giỏ hàng của Lê Văn C

INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
                                                           (1, 1, 2), -- Giỏ hàng 1: 2 bó hoa hồng đỏ
                                                           (1, 2, 1), -- Giỏ hàng 1: 1 lẵng hoa cúc trắng
                                                           (2, 3, 1), -- Giỏ hàng 2: 1 hoa cưới lan tím
                                                           (3, 4, 3); -- Giỏ hàng 3: 3 bó hoa tulip vàng