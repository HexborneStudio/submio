// Validate env at startup — called from a server component or route
import "server-only";
import { validateEnv } from "@authorship-receipt/config/env";

// Run once per server instance
let validated = false;

export function ensureEnvValid(): void {
  if (!validated) {
    validateEnv();
    validated = true;
  }
}
