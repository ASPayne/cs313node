INSERT INTO person(
id             	
,first_name       	
,last_name     	
,birth_date
,gender
)
VALUES(DEFAULT, 'Bruce', 'Virgil', to_date('1985-09-29', 'YYYY-MM-DD'),'MALE'),
(DEFAULT, 'Dean','Burdo', to_date('1986-10-16', 'YYYY-MM-DD'),'MALE'),
(DEFAULT, 'Virgil','Ewell', to_date('1993-06-02', 'YYYY-MM-DD'),'MALE'),
(DEFAULT, 'Zack','Parkerson', to_date('1996-03-01', 'YYYY-MM-DD'),'MALE'),
(DEFAULT, 'Milton','Wilmer', to_date('1998-09-19', 'YYYY-MM-DD'),'MALE'),
(DEFAULT, 'Calandra','Mango', to_date('1986-04-30', 'YYYY-MM-DD'),'FEMALE'),
(DEFAULT, 'Kimi','Berns', to_date('1987-03-08', 'YYYY-MM-DD'),'FEMALE'),
(DEFAULT, 'Alayna', 'Coronel', to_date('1996-08-31', 'YYYY-MM-DD'),'FEMALE'),
(DEFAULT, 'Chana','Arrant', to_date('1997-05-24', 'YYYY-MM-DD'),'FEMALE'),
(DEFAULT, 'Shin','Connolly', to_date('1998-12-22', 'YYYY-MM-DD'),'FEMALE'),
(DEFAULT, 'Yong', 'Wilmer', to_date('2006-07-03', 'YYYY-MM-DD'), 'MALE'),
(DEFAULT, 'Janina', 'Ewell', to_date('2009-10-23', 'YYYY-MM-DD'), 'FEMALE');


INSERT INTO parents_child
(
    id
    ,father_id
    ,mother_id
    ,child_id
)
Values(
    DEFAULT
    , (select id from person WHERE first_name = 'Milton' and last_name = 'Wilmer')
    , (select id from person WHERE first_name = 'Kimi' and last_name = 'Berns')
    ,(select id from person WHERE first_name = 'Yong' and last_name = 'Wilmer')
);
INSERT INTO parents_child
(
    id
    ,father_id
    ,mother_id
    ,child_id
)
Values(
    DEFAULT
    , (select id from person WHERE first_name = 'Virgil' and last_name = 'Ewell')
    , (select id from person WHERE first_name = 'Chana' and last_name = 'Arrant')
    ,(select id from person WHERE first_name = 'Janina' and last_name = 'Ewell')
);