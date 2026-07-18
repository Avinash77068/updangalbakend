# UpDangal Backend

REST API backend for the UpDangal CMS-driven news platform.

## Run

```bash
cd backend
npm install
npm run dev
```

API base URL: `http://localhost:4000/api/v1`

Swagger docs: `http://localhost:4000/docs`

## Default Users

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `updangal@123` |
| Editor | `editor` | `editor@123` |
| Author | `author` | `author@123` |
| User | `user` | `user@123` |

## Architecture

- `src/modules/*`: route, controller, service per domain module
- `src/middleware`: auth, RBAC, validation, rate limiting, errors
- `src/database`: seed-backed repository layer for local development
- `src/config`: env and role configuration
- `uploads/`: uploaded media destination

The repository layer is isolated so MongoDB/PostgreSQL persistence can replace the local seed store without changing controllers.
