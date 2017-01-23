--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.3
-- Dumped by pg_dump version 9.3.3
-- Started on 2017-01-23 21:50:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

DROP DATABASE "TTSar";
--
-- TOC entry 1951 (class 1262 OID 16526)
-- Name: TTSar; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "TTSar" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Russian_Russia.1251' LC_CTYPE = 'Russian_Russia.1251';


ALTER DATABASE "TTSar" OWNER TO postgres;

\connect "TTSar"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 1952 (class 1262 OID 16526)
-- Dependencies: 1951
-- Name: TTSar; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE "TTSar" IS 'Database for troll and trams of Saratov =)';


--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 1953 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 174 (class 3079 OID 11750)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 1955 (class 0 OID 0)
-- Dependencies: 174
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 170 (class 1259 OID 16527)
-- Name: Messages; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "Messages" (
    message character varying(300),
    photo character varying(300),
    datetime timestamp without time zone,
    status character varying(10),
    geo double precision[],
    id integer NOT NULL
);


ALTER TABLE public."Messages" OWNER TO postgres;

--
-- TOC entry 1956 (class 0 OID 0)
-- Dependencies: 170
-- Name: COLUMN "Messages".photo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "Messages".photo IS 'Path to photo';


--
-- TOC entry 171 (class 1259 OID 16533)
-- Name: Messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "Messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Messages_id_seq" OWNER TO postgres;

--
-- TOC entry 1957 (class 0 OID 0)
-- Dependencies: 171
-- Name: Messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Messages_id_seq" OWNED BY "Messages".id;


--
-- TOC entry 172 (class 1259 OID 16535)
-- Name: Routes; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "Routes" (
    id integer NOT NULL,
    way smallint,
    status smallint,
    type smallint,
    message character varying(300)
);


ALTER TABLE public."Routes" OWNER TO postgres;

--
-- TOC entry 173 (class 1259 OID 16538)
-- Name: Test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE "Test_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Test_id_seq" OWNER TO postgres;

--
-- TOC entry 1958 (class 0 OID 0)
-- Dependencies: 173
-- Name: Test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Test_id_seq" OWNED BY "Routes".id;


--
-- TOC entry 1830 (class 2604 OID 16540)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Messages" ALTER COLUMN id SET DEFAULT nextval('"Messages_id_seq"'::regclass);


--
-- TOC entry 1831 (class 2604 OID 16541)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Routes" ALTER COLUMN id SET DEFAULT nextval('"Test_id_seq"'::regclass);


--
-- TOC entry 1943 (class 0 OID 16527)
-- Dependencies: 170
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "Messages" (message, photo, datetime, status, geo, id) VALUES ('NEW PROBLEM', './uploaded_images/1485193315552.base64', '2017-01-23 17:41:55.552', 'unreaded', '{58,67}', 1);
INSERT INTO "Messages" (message, photo, datetime, status, geo, id) VALUES ('DESU', './uploaded_images/1485193351119.base64', '2017-01-23 17:42:31.119', 'unreaded', '{55,567657}', 2);
INSERT INTO "Messages" (message, photo, datetime, status, geo, id) VALUES ('DESFU', './uploaded_images/1485193371636.base64', '2017-01-23 17:42:51.636', 'unreaded', '{55.565464599999999,57.345345000000002}', 3);
INSERT INTO "Messages" (message, photo, datetime, status, geo, id) VALUES ('Message Hereeee', './uploaded_images/1485193382385.base64', '2017-01-23 17:43:02.385', 'unreaded', '{55.565464599999999,57.345345000000002}', 4);
INSERT INTO "Messages" (message, photo, datetime, status, geo, id) VALUES ('Msfg', './uploaded_images/1485193396429.base64', '2017-01-23 17:43:16.429', 'unreaded', '{55.565464599999999,57.345345000000002}', 5);
INSERT INTO "Messages" (message, photo, datetime, status, geo, id) VALUES ('MANEMANEMNYSYMANYWORDSHERE HERE HERE HERE MANY MANY WORDS HERE!!!!!!', './uploaded_images/1485193417113.base64', '2017-01-23 17:43:37.113', 'unreaded', '{55.565464599999999,57.345345000000002}', 6);


--
-- TOC entry 1959 (class 0 OID 0)
-- Dependencies: 171
-- Name: Messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"Messages_id_seq"', 6, true);


--
-- TOC entry 1945 (class 0 OID 16535)
-- Dependencies: 172
-- Data for Name: Routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "Routes" (id, way, status, type, message) VALUES (1, 1, 1, 1, 'Едет далеко');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (2, 2, 1, 1, 'Путь 2 типа 1');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (3, 3, 1, 1, 'Путь 3 типа 1');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (4, 4, 2, 1, 'Путь 3 типа 1');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (5, 5, 2, 1, 'Путь 3апфыпп типа 1');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (6, 6, 2, 1, 'Пвыа1');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (7, 7, 2, 1, 'Мы просто тестируем тапки');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (8, 8, 3, 1, 'Сметана со сметаной');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (9, 9, 3, 1, 'ДУИТ ЛЖАСТ ДУИТ!!');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (10, 91, 3, 2, 'ДУИвапвапТ ЛЖАСТ ДУИТ!!');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (11, 31, 2, 2, 'Так что де лучше?');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (12, 78, 2, 2, 'ТВовка или Линейка?');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (13, 7, 1, 2, 'Тест Тест Тест ТЕст');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (14, 6, 1, 2, 'Тест Тест Тест ТЕст');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (15, 5, 2, 2, 'Тест Тест Тест ТЕст');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (16, 4, 2, 2, 'Тест Тест Тест ТЕст');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (17, 2, 2, 2, 'Тест Тест Тест ТЕст');
INSERT INTO "Routes" (id, way, status, type, message) VALUES (18, 1, 1, 2, 'Тест Тест Тест ТЕст');


--
-- TOC entry 1960 (class 0 OID 0)
-- Dependencies: 173
-- Name: Test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"Test_id_seq"', 18, true);


--
-- TOC entry 1833 (class 2606 OID 16543)
-- Name: Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- TOC entry 1835 (class 2606 OID 16545)
-- Name: Test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "Routes"
    ADD CONSTRAINT "Test_pkey" PRIMARY KEY (id);


--
-- TOC entry 1954 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-01-23 21:50:34

--
-- PostgreSQL database dump complete
--

