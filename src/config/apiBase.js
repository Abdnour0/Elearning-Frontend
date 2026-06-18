/**
 * Base URL for the JSON API (no trailing slash).
 *
 * In production builds VITE_API_URL MUST be set at build time.
 * A missing variable will throw immediately so a broken deployment
 * is caught early rather than silently hitting localhost.
 */
const envUrl = import.meta.env.VITE_API_URL;

if (!envUrl && import.meta.env.PROD) {
  throw new Error(
    '[E-Learning] VITE_API_URL is not defined. ' +
    'Set this environment variable before building for production.'
  );
}

export const API_BASE_URL = envUrl || 'http://localhost:8000/api/v1';
