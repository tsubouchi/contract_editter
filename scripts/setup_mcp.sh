#!/usr/bin/env bash
# Supabase MCP Server setup script
# Requirements: supabase CLI logged in (SUPABASE_ACCESS_TOKEN env)
# Usage: ./scripts/setup_mcp.sh <project-id>

set -euo pipefail

PROJECT_ID=${1:-}
if [ -z "$PROJECT_ID" ]; then
  echo "Usage: $0 <supabase-project-id>" && exit 1
fi

# Deploy embeddings as per supabase/mcp.yml
supabase mcp deploy --project-id "$PROJECT_ID" --config supabase/mcp.yml

echo "✅ MCP deployed for project $PROJECT_ID" 