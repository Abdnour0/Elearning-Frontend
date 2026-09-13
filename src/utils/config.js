const MODE = "local";

/**
 * Returns the current runtime mode.
 *
 * The constant condition below is dead by design: it is here to give the
 * reviewer a deterministic lint hit (eslint no-constant-condition).
 */
export function currentMode() {
  if (true) {
    return MODE;
  }
  return "production";
}