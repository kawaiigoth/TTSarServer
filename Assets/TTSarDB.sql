--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.3
-- Dumped by pg_dump version 9.3.3
-- Started on 2017-01-16 18:48:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

DROP DATABASE "TTSar";
--
-- TOC entry 1947 (class 1262 OID 16393)
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
-- TOC entry 1948 (class 1262 OID 16393)
-- Dependencies: 1947
-- Name: TTSar; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE "TTSar" IS 'Database for troll and trams of Saratov =)';


--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 1949 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 174 (class 3079 OID 11750)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 1951 (class 0 OID 0)
-- Dependencies: 174
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 172 (class 1259 OID 16409)
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
-- TOC entry 1952 (class 0 OID 0)
-- Dependencies: 172
-- Name: COLUMN "Messages".photo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN "Messages".photo IS 'Path to photo';


--
-- TOC entry 173 (class 1259 OID 16431)
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
-- TOC entry 1953 (class 0 OID 0)
-- Dependencies: 173
-- Name: Messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Messages_id_seq" OWNED BY "Messages".id;


--
-- TOC entry 171 (class 1259 OID 16396)
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
-- TOC entry 170 (class 1259 OID 16394)
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
-- TOC entry 1954 (class 0 OID 0)
-- Dependencies: 170
-- Name: Test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE "Test_id_seq" OWNED BY "Routes".id;


--
-- TOC entry 1831 (class 2604 OID 16433)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Messages" ALTER COLUMN id SET DEFAULT nextval('"Messages_id_seq"'::regclass);


--
-- TOC entry 1830 (class 2604 OID 16399)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "Routes" ALTER COLUMN id SET DEFAULT nextval('"Test_id_seq"'::regclass);


--
-- TOC entry 1835 (class 2606 OID 16441)
-- Name: Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- TOC entry 1833 (class 2606 OID 16401)
-- Name: Test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "Routes"
    ADD CONSTRAINT "Test_pkey" PRIMARY KEY (id);


--
-- TOC entry 1950 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-01-16 18:48:31

--
-- PostgreSQL database dump complete
--

