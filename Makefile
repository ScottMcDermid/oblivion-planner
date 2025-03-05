SHELL = /bin/bash
MAKEFLAGS += --silent

export ROOT_DIR=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

touch_local_env = touch .env.local

dev:
	$(touch_local_env)
	docker compose --profile development down
	docker compose --profile development up -d

dev-build:
	$(touch_local_env)
	docker compose --profile development down
	docker compose --profile development up --build -d

dev-stop:
	docker compose --profile development down


prod:
	$(touch_local_env)
	docker compose --profile production down
	docker compose --profile production up -d

prod-build:
	$(touch_local_env)
	docker compose --profile production down
	docker compose --profile production up --build -d

prod-stop:
	docker compose --profile production down
