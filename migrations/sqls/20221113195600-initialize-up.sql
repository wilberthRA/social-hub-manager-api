CREATE TABLE users
(
   id serial,
   username text,
   user_password text,
   PRIMARY KEY (id)
);


CREATE TABLE access_tokens
(
   id serial,
   access_token text,
   user_id integer,
   PRIMARY KEY (id)
);
CREATE TABLE two_fa
(
   id serial,
   secret text,
   user_id integer,
   PRIMARY KEY (id),
   FOREIGN KEY (user_id) REFERENCES users(id)
)