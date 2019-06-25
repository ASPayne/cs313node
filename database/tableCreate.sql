Drop table parents_child;
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
);