-- Create a new user
CREATE USER 'appuser' @'localhost' IDENTIFIED BY 'app2027';

-- Grant all privileges on the groceryGenie database to the new user
GRANT ALL PRIVILEGES ON groceryGenie.* TO 'appuser' @'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
-- MySQL dump 10.13  Distrib 8.0.39, for macos14 (x86_64)
--
-- Host: localhost    Database: groceryGenie
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

--
-- Table structure for table `Fridge`
--

DROP TABLE IF EXISTS `Fridge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Fridge` (
    `fridge_id` int NOT NULL AUTO_INCREMENT,
    `users_id` int NOT NULL,
    `ingredient_id` int NOT NULL,
    PRIMARY KEY (`fridge_id`),
    UNIQUE KEY `fridge_id_UNIQUE` (`fridge_id`),
    KEY `users_id` (`users_id`),
    KEY `ingredient_id` (`ingredient_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 42 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Fridge`
--

LOCK TABLES `Fridge` WRITE;
/*!40000 ALTER TABLE `Fridge` DISABLE KEYS */
;

INSERT INTO
    `Fridge`
VALUES (12, 2, 16),
    (13, 3, 13),
    (22, 2, 12),
    (31, 2, 15),
    (33, 2, 23),
    (34, 2, 17),
    (35, 2, 24),
    (37, 2, 18),
    (40, 2, 26),
    (41, 2, 27);
/*!40000 ALTER TABLE `Fridge` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `Ingredients`
--

DROP TABLE IF EXISTS `Ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `Ingredients` (
    `ingredient_id` int NOT NULL AUTO_INCREMENT,
    `ingredient` varchar(255) NOT NULL,
    PRIMARY KEY (`ingredient_id`),
    UNIQUE KEY `ingredient_id_UNIQUE` (`ingredient_id`),
    UNIQUE KEY `ingredient_UNIQUE` (`ingredient`)
) ENGINE = InnoDB AUTO_INCREMENT = 28 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `Ingredients`
--

LOCK TABLES `Ingredients` WRITE;
/*!40000 ALTER TABLE `Ingredients` DISABLE KEYS */
;

INSERT INTO
    `Ingredients`
VALUES (
        25,
        'alert(\"This ingredient is already in your fridge.\");'
    ),
    (15, 'bread'),
    (23, 'cheese'),
    (19, 'choco'),
    (14, 'cucamber'),
    (24, 'cucumber'),
    (18, 'paste'),
    (27, 'pickles'),
    (13, 'potato'),
    (26, 'rice'),
    (12, 'tomato'),
    (17, 'tuna');
/*!40000 ALTER TABLE `Ingredients` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `users` (
    `users_id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(45) NOT NULL,
    `firstname` varchar(45) NOT NULL,
    `lastname` varchar(45) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(60) NOT NULL,
    PRIMARY KEY (`users_id`),
    UNIQUE KEY `users_id_UNIQUE` (`users_id`),
    UNIQUE KEY `username_UNIQUE` (`username`),
    UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */
;

INSERT INTO
    `users`
VALUES (
        2,
        'bafakihahmad',
        'ahmad',
        'bafakih',
        'aybafakih@gmail.com',
        '$2b$10$j3V5kDPRfgYIGctiBHflX.pIEYlKYDqtqrTIewJ8j/gmPNtlYTFDC'
    ),
    (
        3,
        'bafakihsara',
        'sara',
        'bafakih',
        'test@gmail.coom',
        '$2b$10$MHIIcjRV.sTexXSauUOZ6.WoIFeI1M2EcNMsxvszQIFko3wgWd/RK'
    ),
    (
        4,
        'testuser',
        'testuserfirst',
        'testuserlast',
        'test@gmail.com',
        '$2b$10$xg6YtJhRfL7wHaM8XbmhJO2tk9t2Kd7fwDSBMpwgpAE5Jr6gST7ve'
    );
/*!40000 ALTER TABLE `users` ENABLE KEYS */
;

UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2024-12-10 19:47:50