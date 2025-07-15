#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
#   Use:
#     sh scripts/migrate.sh generate CreateUserTable
#     sh scripts/migrate.sh up
#     sh scripts/migrate.sh down
# ──────────────────────────────────────────────────────────────────────────────
ACTION=$1
NAME=$2

set -a
source .env
set +a

MIGR_DIR="migrations"

case "$ACTION" in
  generate)
    [[ -z $NAME ]] && { echo "❌  Falta nombre de migración"; exit 1; }

    TS_NODE=true npm run migration:generate -- "$MIGR_DIR/$NAME"
    ;;
  up)
    TS_NODE=true npm run migration:run
    ;;
  down)
    TS_NODE=true npm run migration:revert
    ;;
  *)
    echo "Uso: migrate {generate|up|down} [Name]"
    exit 1
    ;;
esac

echo "✔  Action '$ACTION' completed successfully."
