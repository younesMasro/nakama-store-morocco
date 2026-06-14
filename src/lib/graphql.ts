/**
 * Low-level GraphQL fetcher for the WordPress/WooCommerce backend.
 * Reads WORDPRESS_GRAPHQL_URL from env — server-side only (no NEXT_PUBLIC_ prefix needed).
 */

const GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL ??
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ??
  "https://admin.nakamastore.ma/graphql";

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate?: number
): Promise<T> {
  const url = GRAPHQL_URL;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      next: revalidate !== undefined ? { revalidate } : undefined,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(
      `[Nakama] GraphQL HTTP ${res.status} ${res.statusText} — ${url}`
    );
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    const msg = json.errors[0].message;
    // Detect missing WooGraphQL
    if (
      msg.toLowerCase().includes("products") ||
      msg.toLowerCase().includes("woo") ||
      msg.toLowerCase().includes("unknown field")
    ) {
      console.error(
        "[Nakama] ⚠️  WooGraphQL may not be active. " +
          "Enable 'WPGraphQL for WooCommerce' plugin in WordPress admin.",
        "\nGraphQL error:",
        msg
      );
    }
    throw new Error(`[Nakama] GraphQL error: ${msg}`);
  }

  return json.data as T;
}
