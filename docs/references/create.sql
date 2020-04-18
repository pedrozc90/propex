-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: laravel
-- ------------------------------------------------------
-- Server version	10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `activity` varchar(255) NOT NULL,
  `external_activity` tinyint(4) NOT NULL DEFAULT 0,
  `number_of_members` int(11) NOT NULL,
  `date` date NOT NULL,
  `period` int(11) NOT NULL,
  `execution_weekday` varchar(255) NOT NULL,
  `execution_hour` time NOT NULL,
  `results` varchar(180) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_attachments`
--

DROP TABLE IF EXISTS `activity_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(20) unsigned NOT NULL,
  `attachment_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_attachments_activity_id_foreign` (`activity_id`),
  KEY `activity_attachments_attachment_id_foreign` (`attachment_id`),
  CONSTRAINT `activity_attachments_activity_id_foreign` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  CONSTRAINT `activity_attachments_attachment_id_foreign` FOREIGN KEY (`attachment_id`) REFERENCES `attachments` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_attachments`
--

LOCK TABLES `activity_attachments` WRITE;
/*!40000 ALTER TABLE `activity_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `attachment_type` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `original_file_name` varchar(255) NOT NULL,
  `original_file_size` double(8,2) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` double(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborators`
--

DROP TABLE IF EXISTS `collaborators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collaborators` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `academic_function` varchar(255) NOT NULL,
  `profissional_registry` varchar(255) NOT NULL,
  `link_format` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `collaborators_user_id_foreign` (`user_id`),
  CONSTRAINT `collaborators_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborators`
--

LOCK TABLES `collaborators` WRITE;
/*!40000 ALTER TABLE `collaborators` DISABLE KEYS */;
/*!40000 ALTER TABLE `collaborators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disclosure_medias`
--

DROP TABLE IF EXISTS `disclosure_medias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disclosure_medias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `media_name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `link` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `disclosure_medias_project_id_foreign` (`project_id`),
  CONSTRAINT `disclosure_medias_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disclosure_medias`
--

LOCK TABLES `disclosure_medias` WRITE;
/*!40000 ALTER TABLE `disclosure_medias` DISABLE KEYS */;
/*!40000 ALTER TABLE `disclosure_medias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_presentations`
--

DROP TABLE IF EXISTS `event_presentations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_presentations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `modality` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_presentations_project_id_foreign` (`project_id`),
  CONSTRAINT `event_presentations_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_presentations`
--

LOCK TABLES `event_presentations` WRITE;
/*!40000 ALTER TABLE `event_presentations` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_presentations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extension_lines`
--

DROP TABLE IF EXISTS `extension_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `extension_lines` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `line_number` int(11) NOT NULL,
  `line_name` varchar(255) NOT NULL,
  `operation_way` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extension_lines`
--

LOCK TABLES `extension_lines` WRITE;
/*!40000 ALTER TABLE `extension_lines` DISABLE KEYS */;
INSERT INTO `extension_lines` VALUES (1,1,'2006 – Alfabetização, leitura e escrita','Alfabetização e letramento de crianças, jovens e adultos;\r\n            formação do leitor e do produtor de textos; incentivo à\r\n            leitura; literatura; desenvolvimento de metodologias de\r\n            ensino da leitura e da escrita e sua inclusão nos projetos\r\n            político-pedagógicos das escolas.',NULL,NULL);
/*!40000 ALTER TABLE `extension_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finished_projects`
--

DROP TABLE IF EXISTS `finished_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `finished_projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `project_evaluation` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `finished_projects_project_id_foreign` (`project_id`),
  CONSTRAINT `finished_projects_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finished_projects`
--

LOCK TABLES `finished_projects` WRITE;
/*!40000 ALTER TABLE `finished_projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `finished_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `future_development_plans`
--

DROP TABLE IF EXISTS `future_development_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `future_development_plans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `activities` longtext NOT NULL,
  `expected_results` longtext NOT NULL,
  `participants_number_forecast` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `future_development_plans_project_id_foreign` (`project_id`),
  CONSTRAINT `future_development_plans_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `future_development_plans`
--

LOCK TABLES `future_development_plans` WRITE;
/*!40000 ALTER TABLE `future_development_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `future_development_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `human_resource_types`
--

DROP TABLE IF EXISTS `human_resource_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `human_resource_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `human_resource_types`
--

LOCK TABLES `human_resource_types` WRITE;
/*!40000 ALTER TABLE `human_resource_types` DISABLE KEYS */;
INSERT INTO `human_resource_types` VALUES (1,'Informar coordenador e professores com horas/aula e/ou voluntários',NULL,NULL),(2,'Discentes com bolsa',NULL,NULL),(3,'Discentes sem bolsa',NULL,NULL);
/*!40000 ALTER TABLE `human_resource_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `involved_partners`
--

DROP TABLE IF EXISTS `involved_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `involved_partners` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `partner_name` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `involved_partners_project_id_foreign` (`project_id`),
  CONSTRAINT `involved_partners_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `involved_partners`
--

LOCK TABLES `involved_partners` WRITE;
/*!40000 ALTER TABLE `involved_partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `involved_partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knowledge_areas`
--

DROP TABLE IF EXISTS `knowledge_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knowledge_areas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `area` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knowledge_areas`
--

LOCK TABLES `knowledge_areas` WRITE;
/*!40000 ALTER TABLE `knowledge_areas` DISABLE KEYS */;
INSERT INTO `knowledge_areas` VALUES (1,'Ciências Exatas e da Terra',NULL,NULL),(2,'Ciências Biológicas',NULL,NULL),(3,'Engenharia / Tecnologia',NULL,NULL),(4,'Ciências da Saúde',NULL,NULL),(5,'Ciências Agrárias',NULL,NULL),(6,'Ciências Sociais',NULL,NULL),(7,'Ciências Humanas',NULL,NULL),(8,'Lingüística, Letras e Artes',NULL,NULL);
/*!40000 ALTER TABLE `knowledge_areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2019_10_20_162141_create_users_table',1),(2,'2019_11_24_154253_create_projects_table',1),(3,'2019_11_24_155728_create_permissions_table',1),(4,'2019_11_24_174332_create_publics_table',1),(5,'2019_11_29_135247_create_attachments_table',1),(6,'2019_11_29_135643_create_extension_lines_table',1),(7,'2019_11_29_135939_create_human_resource_types_table',1),(8,'2019_11_29_145835_create_collaborators_table',1),(9,'2019_11_29_150311_create_students_table',1),(10,'2019_11_29_150951_create_project_human_resources_table',1),(11,'2019_11_29_152938_create_project_extension_lines_table',1),(12,'2019_11_29_153526_create_user_permissions_table',1),(13,'2019_11_29_153930_create_activities_table',1),(14,'2019_11_29_155302_create_project_targets_table',1),(15,'2019_11_29_164837_create_project_publics_table',1),(16,'2019_11_29_165339_create_activity_attachments_table',1),(17,'2019_11_29_170846_create_involved_partners_table',1),(18,'2019_11_29_173046_create_project_attachments_table',1),(19,'2019_11_29_174456_create_future_development_plans_table',1),(20,'2019_11_29_175120_create_finished_projects_table',1),(21,'2019_11_29_175506_create_new_demands_table',1),(22,'2019_11_29_180328_create_disclosure_medias_table',1),(23,'2019_11_29_180658_create_event_presentations_table',1),(24,'2019_11_29_180849_create_performed_publications_table',1),(25,'2019_11_29_191150_create_knowledge_areas_table',1),(26,'2019_11_29_191355_create_theme_areas_table',1),(27,'2019_11_29_194951_create_project_knowledge_areas_table',1),(28,'2019_11_29_195202_create_project_theme_areas_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `new_demands`
--

DROP TABLE IF EXISTS `new_demands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `new_demands` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `demand` varchar(255) NOT NULL,
  `justification` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `new_demands_project_id_foreign` (`project_id`),
  CONSTRAINT `new_demands_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `new_demands`
--

LOCK TABLES `new_demands` WRITE;
/*!40000 ALTER TABLE `new_demands` DISABLE KEYS */;
/*!40000 ALTER TABLE `new_demands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performed_publications`
--

DROP TABLE IF EXISTS `performed_publications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `performed_publications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `attachment_id` bigint(20) unsigned DEFAULT NULL,
  `type` enum('artigo','capitulo','resumo') NOT NULL,
  `title` varchar(255) NOT NULL,
  `journal_name` varchar(255) NOT NULL,
  `publication_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `performed_publications_project_id_foreign` (`project_id`),
  KEY `performed_publications_attachment_id_foreign` (`attachment_id`),
  CONSTRAINT `performed_publications_attachment_id_foreign` FOREIGN KEY (`attachment_id`) REFERENCES `attachments` (`id`),
  CONSTRAINT `performed_publications_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performed_publications`
--

LOCK TABLES `performed_publications` WRITE;
/*!40000 ALTER TABLE `performed_publications` DISABLE KEYS */;
/*!40000 ALTER TABLE `performed_publications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(180) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_attachments`
--

DROP TABLE IF EXISTS `project_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `attachment_id` bigint(20) unsigned NOT NULL,
  `attachment_type` enum('document','image','video','publication','event','assigns_list','other') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_attachments_project_id_foreign` (`project_id`),
  KEY `project_attachments_attachment_id_foreign` (`attachment_id`),
  CONSTRAINT `project_attachments_attachment_id_foreign` FOREIGN KEY (`attachment_id`) REFERENCES `attachments` (`id`),
  CONSTRAINT `project_attachments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_attachments`
--

LOCK TABLES `project_attachments` WRITE;
/*!40000 ALTER TABLE `project_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_extension_lines`
--

DROP TABLE IF EXISTS `project_extension_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_extension_lines` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `extension_line_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_extension_lines_project_id_foreign` (`project_id`),
  KEY `project_extension_lines_extension_line_id_foreign` (`extension_line_id`),
  CONSTRAINT `project_extension_lines_extension_line_id_foreign` FOREIGN KEY (`extension_line_id`) REFERENCES `extension_lines` (`id`),
  CONSTRAINT `project_extension_lines_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_extension_lines`
--

LOCK TABLES `project_extension_lines` WRITE;
/*!40000 ALTER TABLE `project_extension_lines` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_extension_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_human_resources`
--

DROP TABLE IF EXISTS `project_human_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_human_resources` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `project_id` bigint(20) unsigned NOT NULL,
  `human_resource_type_id` bigint(20) unsigned NOT NULL,
  `is_coordinate` tinyint(4) NOT NULL DEFAULT 0,
  `workload` int(11) NOT NULL,
  `is_exclusive` int(11) NOT NULL DEFAULT 0,
  `init_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_human_resources_user_id_foreign` (`user_id`),
  KEY `project_human_resources_project_id_foreign` (`project_id`),
  KEY `project_human_resources_human_resource_type_id_foreign` (`human_resource_type_id`),
  CONSTRAINT `project_human_resources_human_resource_type_id_foreign` FOREIGN KEY (`human_resource_type_id`) REFERENCES `human_resource_types` (`id`),
  CONSTRAINT `project_human_resources_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_human_resources_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_human_resources`
--

LOCK TABLES `project_human_resources` WRITE;
/*!40000 ALTER TABLE `project_human_resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_human_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_knowledge_areas`
--

DROP TABLE IF EXISTS `project_knowledge_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_knowledge_areas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `knowledge_area_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_knowledge_areas_project_id_foreign` (`project_id`),
  KEY `project_knowledge_areas_knowledge_area_id_foreign` (`knowledge_area_id`),
  CONSTRAINT `project_knowledge_areas_knowledge_area_id_foreign` FOREIGN KEY (`knowledge_area_id`) REFERENCES `knowledge_areas` (`id`),
  CONSTRAINT `project_knowledge_areas_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_knowledge_areas`
--

LOCK TABLES `project_knowledge_areas` WRITE;
/*!40000 ALTER TABLE `project_knowledge_areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_knowledge_areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_publics`
--

DROP TABLE IF EXISTS `project_publics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_publics` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `public_id` bigint(20) unsigned NOT NULL,
  `directly` tinyint(4) NOT NULL DEFAULT 0,
  `other_public_title` varchar(255) DEFAULT NULL,
  `other_public_cras` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_publics_project_id_foreign` (`project_id`),
  KEY `project_publics_public_id_foreign` (`public_id`),
  CONSTRAINT `project_publics_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_publics_public_id_foreign` FOREIGN KEY (`public_id`) REFERENCES `publics` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_publics`
--

LOCK TABLES `project_publics` WRITE;
/*!40000 ALTER TABLE `project_publics` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_publics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_targets`
--

DROP TABLE IF EXISTS `project_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_targets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `men_number` int(11) DEFAULT NULL,
  `women_number` int(11) DEFAULT NULL,
  `age_range` enum('Até 12 anos incompletos','Até 18 anos','De 19 a 25 anos','De 26 a 30 anos','De 31 a 50 anos','De 51 a 60 anos','De 61a 70 anos','Acima de 70 anos') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_targets_project_id_foreign` (`project_id`),
  CONSTRAINT `project_targets_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_targets`
--

LOCK TABLES `project_targets` WRITE;
/*!40000 ALTER TABLE `project_targets` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_theme_areas`
--

DROP TABLE IF EXISTS `project_theme_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_theme_areas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `theme_area_id` bigint(20) unsigned NOT NULL,
  `main_area` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_theme_areas_project_id_foreign` (`project_id`),
  KEY `project_theme_areas_theme_area_id_foreign` (`theme_area_id`),
  CONSTRAINT `project_theme_areas_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_theme_areas_theme_area_id_foreign` FOREIGN KEY (`theme_area_id`) REFERENCES `theme_areas` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_theme_areas`
--

LOCK TABLES `project_theme_areas` WRITE;
/*!40000 ALTER TABLE `project_theme_areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_theme_areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `institutional_link_name` varchar(255) DEFAULT NULL,
  `start_season` varchar(15) NOT NULL,
  `involved_classes` longtext NOT NULL,
  `pcc_calendar_classes_articulation` longtext NOT NULL,
  `preview_credits_classes` longtext NOT NULL,
  `infrastructure` longtext NOT NULL,
  `public_participation` longtext NOT NULL,
  `accompaniment_and_evaluation` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publics`
--

DROP TABLE IF EXISTS `publics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `publics` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cras` varchar(180) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publics`
--

LOCK TABLES `publics` WRITE;
/*!40000 ALTER TABLE `publics` DISABLE KEYS */;
INSERT INTO `publics` VALUES (1,'Escolas públicas',NULL,NULL,NULL,NULL),(2,'Escolas particulares',NULL,NULL,NULL,NULL),(3,'Associações',NULL,NULL,NULL,NULL),(4,'Pequenos produtores',NULL,NULL,NULL,NULL),(5,'Pessoas com deficiência',NULL,NULL,NULL,NULL),(6,'Negros/Índios/Quilombolas',NULL,NULL,NULL,NULL),(7,'Adolescentes em conflito com a lei',NULL,NULL,NULL,NULL),(8,'Indivíduos apenados e/ou egressos do sistema penitenciário',NULL,NULL,NULL,NULL),(9,'Indivíduos em situação de rua (moradores de rua)',NULL,NULL,NULL,NULL),(10,'Migrantes/Imigrantes',NULL,NULL,NULL,NULL),(11,'Família',NULL,NULL,NULL,NULL),(12,'Usuários de substâncias psicoativas',NULL,NULL,NULL,NULL),(13,'Comunidades locais',NULL,NULL,NULL,NULL),(14,'Comunidade científica',NULL,NULL,NULL,NULL),(15,'Lideranças Locais',NULL,NULL,NULL,NULL),(16,'Moradores de área de ocupação',NULL,NULL,NULL,NULL),(17,'Outras ONG’s',NULL,NULL,NULL,NULL),(18,'Organizações/movimentos populares',NULL,NULL,NULL,NULL),(19,'Outros',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `publics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `student_code` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `period` int(11) NOT NULL,
  `has_scholarship` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `students_user_id_foreign` (`user_id`),
  CONSTRAINT `students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme_areas`
--

DROP TABLE IF EXISTS `theme_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `theme_areas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `area` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme_areas`
--

LOCK TABLES `theme_areas` WRITE;
/*!40000 ALTER TABLE `theme_areas` DISABLE KEYS */;
INSERT INTO `theme_areas` VALUES (1,'Comunicação',NULL,NULL),(2,'Meio Ambiente',NULL,NULL),(3,'Cultura',NULL,NULL),(4,'Saúde',NULL,NULL),(5,'Direitos Humanos e Justiça',NULL,NULL),(6,'Tecnologia e Produção',NULL,NULL),(7,'Educação',NULL,NULL),(8,'Trabalho',NULL,NULL);
/*!40000 ALTER TABLE `theme_areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `permission_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_permissions_user_id_foreign` (`user_id`),
  KEY `user_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `user_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `user_permissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@gmail.com','99999999999','admin',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'laravel'
--

--
-- Dumping routines for database 'laravel'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-05 17:45:34
