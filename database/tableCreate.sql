/* Drop table parents_child;
Drop TABLE person;


CREATE TABLE person
(
	id             		SERIAL       NOT NULL PRIMARY KEY,
	first_name       	VARCHAR(40)  NOT NULL,
	last_name      		VARCHAR(40)  NOT NULL,
	birth_date          DATE         NOT NULL,
    gender              VARCHAR(6)   NOT NULL CHECK (gender in ('MALE', 'FEMALE'))
);

Create TABLE parents_child
(
    id                  SERIAL       NOT NULL PRIMARY KEY,
    father_id           INT          NOT NULL REFERENCES person(id),
    mother_id           INT          NOT NULL REFERENCES person(id),
    child_id            INT          NOT NULL REFERENCES person(id)
); */

drop table public.requests;
drop table public.user;

CREATE TABLE public.user
(
    id             		SERIAL       NOT NULL PRIMARY KEY,
	first_name       	VARCHAR(40)  NOT NULL,
	last_name      		VARCHAR(40)  NOT NULL,
    email               VARCHAR(40)  NOT NULL,
    password           VARCHAR(40)  NOT NULL,
    usertype            VARCHAR(10)  NOT NULL CHECK(usertype in ('student', 'assistant'))
);

CREATE TABLE public.requests
(
    id                  SERIAL       NOT NULL PRIMARY KEY,
    request_by          INT          NOT NULL REFERENCES public.user(id),
    issue_description   VARCHAR(200),
    lab_number          INT          NOT NULL,
    helped_status       VARCHAR(10)  Not NULL CHECK(helped_status in ('yes', 'no', 'current')),
    request_timestamp   TIMESTAMP    NOT NULL,
    request_closed_timestamp TIMESTAMP
);