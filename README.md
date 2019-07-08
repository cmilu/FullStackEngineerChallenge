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

# Test

```
> npm run test
```

# Tech Stack

- language: TS
- client: React + Blueprint + css-modules(postCSS)
- server: express + sqlite3
