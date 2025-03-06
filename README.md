## Oblivion Planner

Plan your character's leveling trajectory.

### Launching

#### Development

First, ensure `docker`, `docker compose` and `make` are installed.

Now start the development server

```bash
make dev
```

Naviage to [http://localhost:3000](http://localhost:3000)

#### Deploying

Instead of starting the development server, start production:

```bash
make prod
```

Naviage to [http://localhost:3000](http://localhost:3000)

### Environment Variables

You can modify `.env` for any locally defined environment variables

| Name   | Purpose                |
| ------ | ---------------------- |
| `PORT` | Port server listens to |
