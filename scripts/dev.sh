#!/usr/bin/env bash
set -euo pipefail

VM_NAME="beacons"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LIMA_CONFIG="$REPO_ROOT/lima/beacons.yaml"
SETUP_MARKER=".beacons-setup-done"
PORTS=(3000 3001 3005 8080 5432 6379 9200 5601)

usage() {
  cat <<'EOF'
Runs Beacons in a Lima VM, with local authentication and no Azure credentials.

  ./scripts/dev.sh          Start the VM if needed, then serve the app
  ./scripts/dev.sh setup    Re-run `make setup` inside the VM
  ./scripts/dev.sh shell    Open a shell in the VM, at the repository
  ./scripts/dev.sh down     Stop the VM
  ./scripts/dev.sh rebuild  Delete the VM and build it again from scratch
  ./scripts/dev.sh status   Show the VM and what is listening
EOF
}

say() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }
warn() { printf "\033[33m!! %s\033[0m\n" "$1" >&2; }
die() {
  printf "\033[31m!! %s\033[0m\n" "$1" >&2
  exit 1
}

if [ "${BEACONS_WATCH_POLLING:-}" = "true" ]; then
  WATCH_ENV="CHOKIDAR_USEPOLLING=true WATCHPACK_POLLING=true"
else
  WATCH_ENV=""
fi

in_vm() {
  limactl shell "$VM_NAME" -- bash -lc "cd '$REPO_ROOT' && BEACONS_LOCAL_AUTH=true $WATCH_ENV $1"
}

VM_LOCAL_DIRS=(node_modules webapp/node_modules backoffice/node_modules webapp/.next)

vm_exists() { limactl list --quiet 2>/dev/null | grep -qx "$VM_NAME"; }
vm_running() { [ "$(limactl list "$VM_NAME" --format '{{.Status}}' 2>/dev/null || true)" = "Running" ]; }

require_lima() {
  if command -v limactl >/dev/null 2>&1; then return; fi

  say "Installing Lima"
  command -v brew >/dev/null 2>&1 ||
    die "Homebrew is needed to install Lima. See https://brew.sh, then run this again."
  brew install lima
}

create_vm() {
  say "Creating the '$VM_NAME' VM (this downloads Ubuntu and Docker, so the first run takes a while)"
  limactl start \
    --name="$VM_NAME" \
    --mount-only "$REPO_ROOT:w" \
    --tty=false \
    "$LIMA_CONFIG"
}

start_vm() {
  require_lima

  if ! vm_exists; then
    create_vm
    return
  fi

  if ! vm_running; then
    say "Starting the '$VM_NAME' VM"
    limactl start "$VM_NAME"
  fi
}

mount_vm_local_dirs() {
  local rel store target
  for rel in "${VM_LOCAL_DIRS[@]}"; do
    target="$REPO_ROOT/$rel"
    store="/var/lib/beacons-vm/${rel//\//_}"
    limactl shell "$VM_NAME" -- bash -lc "
      set -eu
      sudo mkdir -p '$store'
      sudo chown \"\$(id -u):\$(id -g)\" '$store'
      mkdir -p '$target'
      mountpoint -q '$target' || sudo mount --bind '$store' '$target'
    "
  done
}

run_setup() {
  say "Installing Node and the dependencies in the VM (mise, then npm install)"
  in_vm "make setup"
  in_vm "touch \"\$HOME/$SETUP_MARKER\""
}

setup_if_needed() {
  if in_vm "test -f \"\$HOME/$SETUP_MARKER\"" >/dev/null 2>&1; then return; fi
  run_setup
}

warn_about_busy_ports() {
  local busy=()
  for port in "${PORTS[@]}"; do
    if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then busy+=("$port"); fi
  done

  if [ ${#busy[@]} -gt 0 ]; then
    warn "Already in use on your Mac: ${busy[*]}. The VM cannot forward those ports until whatever is using them stops."
  fi
}

announce_when_ready() {
  local url="http://localhost:8080/spring-api/actuator/health"
  local waited=0

  while ! curl -sf -o /dev/null --max-time 5 "$url" 2>/dev/null; do
    sleep 5
    waited=$((waited + 5))
    if [ "$waited" = 60 ]; then
      say "Still starting. The first run builds the service image, which takes a few minutes."
    fi
    [ "$waited" -ge 1200 ] && return
  done

  cat <<EOF

  --------------------------------------------------------------
  Beacons is ready.

  Webapp      http://localhost:3000    sign in as dev@beacons.local / password
  Backoffice  http://localhost:3001    signed in automatically
  API         http://localhost:8080/spring-api
  Dashboards  http://localhost:5601

  Edit files on your Mac as usual. Press Ctrl-C to stop.
  --------------------------------------------------------------

EOF
}

serve() {
  say "Starting Beacons with local authentication. The URLs appear once the API is up."
  announce_when_ready &
  in_vm "make serve"
}

case "${1:-up}" in
up)
  start_vm
  mount_vm_local_dirs
  setup_if_needed
  warn_about_busy_ports
  serve
  ;;
setup)
  start_vm
  mount_vm_local_dirs
  run_setup
  ;;
shell)
  start_vm
  mount_vm_local_dirs
  say "Opening a shell in the VM. Run git here if your Mac has no Node or Terraform."
  limactl shell "$VM_NAME" --workdir "$REPO_ROOT"
  ;;
down)
  vm_exists || die "There is no '$VM_NAME' VM."
  say "Stopping the '$VM_NAME' VM"
  limactl stop "$VM_NAME"
  ;;
rebuild)
  require_lima
  if vm_exists; then
    say "Deleting the '$VM_NAME' VM"
    limactl delete --force --tty=false "$VM_NAME"
  fi
  create_vm
  mount_vm_local_dirs
  run_setup
  ;;
status)
  require_lima
  limactl list "$VM_NAME" || true
  vm_running && in_vm "docker compose ps" || true
  ;;
*)
  usage
  exit 1
  ;;
esac
