-- 创建塔罗占卜数据库
CREATE DATABASE IF NOT EXISTS tarot_db;

-- 创建测试数据库（用于测试环境）
CREATE DATABASE IF NOT EXISTS tarot_test;

-- 使用主数据库
\c tarot_db;

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户（如果需要）
-- CREATE USER tarot_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE tarot_db TO tarot_user;
-- GRANT ALL PRIVILEGES ON DATABASE tarot_test TO tarot_user;