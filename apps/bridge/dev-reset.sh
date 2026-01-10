#!/bin/bash
set -e

# Source shell profile to get nvm and yarn
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
elif [ -f ~/.bash_profile ]; then
    source ~/.bash_profile
fi

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default mode
MODE="emily"  # emily, full, or signers
CLEAN=false
RESTART=false

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --full)
            MODE="full"
            shift
            ;;
        --signers)
            MODE="signers"
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --restart)
            RESTART=true
            shift
            ;;
        --help|-h)
            cat << 'EOF'
🔄 sBTC Bridge Dev Environment Reset
====================================

USAGE:
    ./dev-reset.sh [MODE] [OPTIONS]

MODES:
    (none)      Emily API only (lightweight, fast - for UI testing)
    --full      Full blockchain stack (Bitcoin + Stacks + Mempool + Emily)
    --signers   Full stack + sBTC signers (production-like, complete testing)

OPTIONS:
    --restart   Quick restart of existing services (preserves data, ~10 sec)
                Falls back to fresh start if no containers running
    --clean     Perform aggressive cleanup before starting (same as no --restart)
    --help, -h  Show this help message

TIMING:
    Emily only:           ~30 seconds (fresh start)
    --full:               2-3 minutes (fresh start)
    --full --restart:     ~10 seconds (if already running)
    --signers:            5-10 minutes (fresh start, includes Rust build)
    --signers --restart:  ~15 seconds (if already running)

FRESH START vs RESTART:
    Fresh Start (default):
        • Wipes ALL data (docker compose down -v)
        • Starts fresh local devnet (empty blockchain state)
        • Cleans up all volumes and networks
        • Takes 2-3 minutes for --full
        • Use when: blockchain state corrupted, first setup, major changes

    Restart (--restart flag):
        • Preserves blockchain state and data
        • Just restarts Docker containers
        • Takes ~10 seconds for --full
        • Use when: testing code changes, iterating on features

WHAT GETS PRESERVED ON RESTART:
    ✓ Blockchain state (Bitcoin blocks, Stacks state)
    ✓ Database data (Emily DynamoDB, PostgreSQL)
    ✓ Container volumes and networks
    ✓ Wallet balances and transactions

COMMON WORKFLOWS:

    Testing Balance Displays:
        First run today:      ./dev-reset.sh --full
        Every restart after:  ./dev-reset.sh --full --restart

    Frontend Development:
        Quick UI testing:     ./dev-reset.sh
        With blockchain APIs: ./dev-reset.sh --full --restart

    Integration Testing:
        Full stack:           ./dev-reset.sh --full
        With signers:         ./dev-reset.sh --signers

    Blockchain Reset:
        Corrupted state:      ./dev-reset.sh --full
        Fresh start:          ./dev-reset.sh --full --clean

EXAMPLES:
    ./dev-reset.sh
        Quick start for UI testing (Emily only)

    ./dev-reset.sh --full
        Full blockchain for integration testing (fresh start, 2-3 min)

    ./dev-reset.sh --full --restart
        Full blockchain quick restart (preserves data, ~10 sec)

    ./dev-reset.sh --signers
        Production-like environment (fresh start, 5-10 min)

    ./dev-reset.sh --signers --restart
        Production-like quick restart (~15 sec)

SERVICES BY MODE:
    Emily only:
        • Emily API:      http://127.0.0.1:3031
        • Bridge App:     http://localhost:3000

    --full:
        • Emily API:      http://127.0.0.1:3031
        • Stacks API:     http://127.0.0.1:3999
        • Mempool API:    http://127.0.0.1:8999
        • Mempool Web:    http://127.0.0.1:8083
        • Bitcoin RPC:    http://127.0.0.1:18443 (user: devnet, pass: devnet)
        • Bridge App:     http://localhost:3000

    --signers:
        All of the above plus:
        • sBTC Signer 1:  http://127.0.0.1:8801
        • sBTC Signer 2:  http://127.0.0.1:8802
        • sBTC Signer 3:  http://127.0.0.1:8803

TROUBLESHOOTING:
    If restart fails, the script will automatically fall back to fresh start.
    If services don't come up, check Docker logs:
        docker compose -f sbtc/docker/docker-compose.yml logs -f

    To manually stop all services:
        cd sbtc && make devenv-down

EOF
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Run '$0 --help' for usage information"
            exit 1
            ;;
    esac
done

# Display mode banner
echo "🔄 sBTC Bridge Dev Environment Reset"
echo "===================================="
case "$MODE" in
    emily)
        echo -e "${BLUE}Mode: Lightweight (Emily API only)${NC}"
        echo "Fast startup for UI/frontend testing"
        ;;
    full)
        echo -e "${BLUE}Mode: Full Blockchain Stack${NC}"
        echo "Bitcoin + Stacks + Mempool + Emily APIs"
        ;;
    signers)
        echo -e "${BLUE}Mode: Production-like (with sBTC Signers)${NC}"
        echo "Complete stack including multi-sig signers"
        ;;
esac
echo ""

# Check if Docker is running
echo "📦 Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}Docker is not running. Starting Docker...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open -a Docker
        echo "Waiting for Docker to start..."
        # Wait up to 60 seconds for Docker to be ready
        for i in {1..60}; do
            if docker info > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Docker started${NC}"
                break
            fi
            sleep 1
            if [ $i -eq 60 ]; then
                echo -e "${RED}❌ Docker failed to start after 60 seconds${NC}"
                exit 1
            fi
        done
    else
        echo -e "${RED}Please start Docker manually and try again${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Docker is running${NC}"
fi

echo ""

# Check if we should restart existing containers
cd sbtc
SHOULD_RESTART=false

if [ "$RESTART" = true ]; then
    if check_containers_running "$MODE"; then
        echo "🔄 Restart mode: Containers detected, performing quick restart..."
        SHOULD_RESTART=true
    else
        echo -e "${YELLOW}⚠️  Restart mode requested but no containers running. Performing fresh start...${NC}"
        SHOULD_RESTART=false
    fi
fi

if [ "$SHOULD_RESTART" = true ]; then
    # Quick restart: just restart containers, preserve data
    echo "🔄 Restarting containers (data preserved)..."

    # Build profile arguments based on mode
    profiles=""
    case "$MODE" in
        emily)
            profiles="--profile default"
            ;;
        full)
            profiles="--profile default --profile bitcoin-mempool --profile observability"
            ;;
        signers)
            profiles="--profile default --profile bitcoin-mempool --profile observability --profile sbtc-signer"
            ;;
    esac

    docker compose -f docker/docker-compose.yml $profiles restart
    echo -e "${GREEN}✅ Quick restart complete${NC}"
else
    # Full cleanup and fresh start
    echo "🧹 Cleaning up old containers..."

    # Mode-aware cleanup
    case "$MODE" in
        emily)
            docker compose -f docker/docker-compose.yml --profile default down -v 2>/dev/null || true
            ;;
        full)
            docker compose -f docker/docker-compose.yml --profile default --profile bitcoin-mempool --profile observability down -v 2>/dev/null || true
            ;;
        signers)
            docker compose -f docker/docker-compose.yml --profile default --profile bitcoin-mempool --profile observability --profile sbtc-signer down -v 2>/dev/null || true
            ;;
    esac

    # Kill any processes still using critical ports
    echo "🔪 Freeing up ports..."
    PORTS_TO_FREE="3000 3031 3999"

    # Add additional ports based on mode
    case "$MODE" in
        full|signers)
            PORTS_TO_FREE="$PORTS_TO_FREE 18443 8083 8999 20443"
            ;;
    esac

    if [ "$MODE" = "signers" ]; then
        PORTS_TO_FREE="$PORTS_TO_FREE 8801 8802 8803 5432 5433 5434"
    fi

    for port in $PORTS_TO_FREE; do
        pid=$(lsof -ti:$port 2>/dev/null || true)
        if [ ! -z "$pid" ]; then
            echo "  Killing process on port $port (PID: $pid)"
            kill -9 $pid 2>/dev/null || true
            sleep 0.5  # Give port time to release
        fi
    done

    # Double check ports are free
    echo "Verifying ports are free..."
    sleep 1
    for port in $PORTS_TO_FREE; do
        if lsof -ti:$port > /dev/null 2>&1; then
            echo -e "${RED}❌ Warning: Port $port still in use!${NC}"
            lsof -ti:$port | xargs ps -p 2>/dev/null || true
        fi
    done

    echo -e "${GREEN}✅ Cleanup complete${NC}"
fi

echo ""

# Function to wait for a service with timeout
wait_for_service() {
    local name=$1
    local url=$2
    local max_attempts=${3:-60}
    local attempt=0

    echo "⏳ Waiting for $name..."
    while [ $attempt -lt $max_attempts ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name ready${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done

    echo -e "${RED}❌ $name failed to start after ${max_attempts}s${NC}"
    return 1
}

# Function to check if containers are running for current mode
check_containers_running() {
    local mode=$1
    local compose_file="docker/docker-compose.yml"

    # Build profile arguments based on mode
    local profiles=""
    case "$mode" in
        emily)
            profiles="--profile default"
            ;;
        full)
            profiles="--profile default --profile bitcoin-mempool --profile observability"
            ;;
        signers)
            profiles="--profile default --profile bitcoin-mempool --profile observability --profile sbtc-signer"
            ;;
    esac

    # Check if any containers from these profiles are running
    local running_count=$(docker compose -f "$compose_file" $profiles ps -q 2>/dev/null | wc -l | tr -d ' ')

    if [ "$running_count" -gt 0 ]; then
        return 0  # Containers are running
    else
        return 1  # No containers running
    fi
}

# Start services based on mode
if [ "$SHOULD_RESTART" = true ]; then
    # Services already restarted, just wait for them to be ready
    echo ""
    echo "⏳ Waiting for restarted services to be ready..."

    case "$MODE" in
        emily)
            wait_for_service "Emily API" "http://127.0.0.1:3031/limits"
            ;;
        full)
            wait_for_service "Emily API" "http://127.0.0.1:3031/limits"
            wait_for_service "Stacks API" "http://127.0.0.1:3999/extended/v1/status" 90
            wait_for_service "Mempool API" "http://127.0.0.1:8999/api/v1/blocks/tip/height" 60
            echo -e "${GREEN}✅ All blockchain services ready!${NC}"
            ;;
        signers)
            wait_for_service "Emily API" "http://127.0.0.1:3031/limits"
            wait_for_service "Stacks API" "http://127.0.0.1:3999/extended/v1/status" 90
            wait_for_service "Mempool API" "http://127.0.0.1:8999/api/v1/blocks/tip/height" 60
            wait_for_service "sBTC Signer 1" "http://127.0.0.1:8801/metrics" 120
            wait_for_service "sBTC Signer 2" "http://127.0.0.1:8802/metrics" 30
            wait_for_service "sBTC Signer 3" "http://127.0.0.1:8803/metrics" 30
            echo -e "${GREEN}✅ All services including signers ready!${NC}"
            ;;
    esac
else
    # Fresh start - need to start services
    case "$MODE" in
        emily)
            echo "🔨 Starting Emily API only (lightweight for UI testing)..."
            docker compose -f docker/docker-compose.yml up -d emily-dynamodb emily-aws-setup emily-server

            wait_for_service "Emily API" "http://127.0.0.1:3031/limits"
            ;;

        full)
            echo "🔨 Starting full blockchain stack..."
            echo "   This will take 2-3 minutes..."

            # Use Makefile target for full stack without signers
            make devenv-no-sbtc-up

            echo ""
            echo "⏳ Waiting for services to be ready..."
            wait_for_service "Emily API" "http://127.0.0.1:3031/limits"
            wait_for_service "Stacks API" "http://127.0.0.1:3999/extended/v1/status" 90
            wait_for_service "Mempool API" "http://127.0.0.1:8999/api/v1/blocks/tip/height" 60

            echo -e "${GREEN}✅ All blockchain services ready!${NC}"
            ;;

        signers)
            echo "🔨 Starting full stack with sBTC signers..."
            echo "   This will take 5-10 minutes (includes Rust build)..."

            # Use Makefile target for complete stack
            make devenv-up

            echo ""
            echo "⏳ Waiting for services to be ready..."
            wait_for_service "Emily API" "http://127.0.0.1:3031/limits"
            wait_for_service "Stacks API" "http://127.0.0.1:3999/extended/v1/status" 90
            wait_for_service "Mempool API" "http://127.0.0.1:8999/api/v1/blocks/tip/height" 60
            wait_for_service "sBTC Signer 1" "http://127.0.0.1:8801/metrics" 120
            wait_for_service "sBTC Signer 2" "http://127.0.0.1:8802/metrics" 30
            wait_for_service "sBTC Signer 3" "http://127.0.0.1:8803/metrics" 30

            echo -e "${GREEN}✅ All services including signers ready!${NC}"
            ;;
    esac
fi

echo ""
echo "🚀 Starting bridge dev server..."

# Go back to repo root and start yarn dev
cd ..
corepack yarn dev > /tmp/sbtc-bridge-dev.log 2>&1 &
BRIDGE_PID=$!

echo "Bridge starting (PID: $BRIDGE_PID, logs: /tmp/sbtc-bridge-dev.log)..."

# Wait for Next.js dev server
wait_for_service "Bridge dev server" "http://localhost:3000"

echo ""
echo "================================================"
echo -e "${GREEN}✅ sBTC Bridge Development Environment Ready!${NC}"
echo "================================================"
echo ""

# Mode-specific service list
case "$MODE" in
    emily)
        echo "Services running:"
        echo "  • Emily API:  http://127.0.0.1:3031"
        echo "  • Bridge App: http://localhost:3000"
        echo ""
        echo -e "${YELLOW}Note: Using lightweight mode. For full blockchain APIs, run:${NC}"
        echo -e "${YELLOW}  ./dev-reset.sh --full${NC}"
        ;;

    full)
        echo "Services running:"
        echo "  • Emily API:      http://127.0.0.1:3031"
        echo "  • Stacks API:     http://127.0.0.1:3999"
        echo "  • Mempool API:    http://127.0.0.1:8999"
        echo "  • Mempool Web:    http://127.0.0.1:8083"
        echo "  • Bitcoin RPC:    http://127.0.0.1:18443 (user: devnet, pass: devnet)"
        echo "  • Bridge App:     http://localhost:3000"
        echo ""
        echo "Balance display should now work with real blockchain data!"
        ;;

    signers)
        echo "Services running:"
        echo "  • Emily API:      http://127.0.0.1:3031"
        echo "  • Stacks API:     http://127.0.0.1:3999"
        echo "  • Mempool API:    http://127.0.0.1:8999"
        echo "  • Mempool Web:    http://127.0.0.1:8083"
        echo "  • Bitcoin RPC:    http://127.0.0.1:18443 (user: devnet, pass: devnet)"
        echo "  • sBTC Signer 1:  http://127.0.0.1:8801"
        echo "  • sBTC Signer 2:  http://127.0.0.1:8802"
        echo "  • sBTC Signer 3:  http://127.0.0.1:8803"
        echo "  • Bridge App:     http://localhost:3000"
        echo ""
        echo "Full production-like environment ready for end-to-end testing!"
        ;;
esac

echo ""
echo "Logs:"
echo "  • Bridge: tail -f /tmp/sbtc-bridge-dev.log"
if [ "$MODE" != "emily" ]; then
    echo "  • Docker: docker compose -f sbtc/docker/docker-compose.yml logs -f"
fi
echo ""
echo "To stop:"
echo -e "${YELLOW}  • Bridge: kill $BRIDGE_PID${NC}"
if [ "$MODE" != "emily" ]; then
    echo -e "${YELLOW}  • Services: cd sbtc && make devenv-down${NC}"
fi
echo ""
