ACTION=$1
NAME=$2

set +e

trap 'echo "⚠️ Skipping: BASH_COMMAND"; true' ERR

# 3) Cargar variables de entorno (si existe .env)
if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

MIGR_DIR="migrations"

case "$ACTION" in
  generate)
    if [[ -z $NAME ]]; then
      echo "❌  Missing Name"; 
    else
      TS_NODE=true POSTGRES_HOST=localhost npm run migration:generate -- "$MIGR_DIR/$NAME" || true
    fi
    ;;
  up)
    TS_NODE=true POSTGRES_HOST=localhost npm run migration:run   || true
    ;;
  down)
    TS_NODE=true POSTGRES_HOST=localhost npm run migration:revert || true
    ;;
  *)
    echo "Script: migrate {generate|up|down} [Name]"
    ;;
esac

echo "✔ Action Completed"
exit 0
