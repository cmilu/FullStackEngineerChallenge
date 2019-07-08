# Revyou

A simple review system.

> original requirement is [here](./docs/assignment.md)

# Demo

To run the app locally (node >= 10):

```
> npm bootstrap
> npm run dev
```

Then access `http://localhost:8080/`, you should be able login with admin/non-admin account.

# Features

Following features are implemented

- [admin] add/update/delete employee
- [admin] view reviewe/update reviewer assignment
- [home] view reviews/review others

Manuals are detailed [here](./docs/manual.md)

# Tech Stack

General

| item       | why                                        |
| ---------- | ------------------------------------------ |
| lerna      | familiar, easy to manage monorepos         |
| TypeScript | familiar, safer and easier with type check |
| travis     | good CI                                    |

FrontEnd

| item                                   | why                                                      |
| -------------------------------------- | -------------------------------------------------------- |
| React + css-modules(postCSS) + webpack | familiar                                                 |
| [Blueprint](https://blueprintjs.com/)  | never used it before, searched and like the simple style |
| stylelint + prettier                   | makes life easier                                        |
| jest                                   | familiar                                                 |

BackEnd

| item                                              | why                           |
| ------------------------------------------------- | ----------------------------- |
| express + [knexjs](https://knexjs.org/) + sqlite3 | familiar, sqlite3 is for demo |
| express-session(memory store)                     | handling session              |
| jest + supertest                                  | familiar                      |
