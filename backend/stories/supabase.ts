import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL_V2;
const supabaseKey = process.env.SUPABASE_KEY_V2;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key not set in .env file");
}
export class SupabaseClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(url: string, key: string) {
    this.baseUrl = url;
    this.apiKey = key;
  }

  async query<T>(table: string, options: {
    select?: string;
    eq?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}): Promise<T[]> {
    let url = `${this.baseUrl}/rest/v1/${table}`;
    const params = new URLSearchParams();

    if (options.select) {
      params.append("select", options.select);
    }

    if (options.eq) {
      for (const [key, value] of Object.entries(options.eq)) {
        params.append(key, `eq.${value}`);
      }
    }

    if (options.order) {
      params.append("order", `${options.order.column}.${options.order.ascending !== false ? "asc" : "desc"}`);
    }

    if (options.limit) {
      params.append("limit", options.limit.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        "apikey": this.apiKey,
        "Authorization": `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase query failed: ${response.statusText}`);
    }

    return await response.json() as T[];
  }

  async insert<T>(table: string, data: any): Promise<T> {
    const url = `${this.baseUrl}/rest/v1/${table}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": this.apiKey,
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Supabase insert failed: ${response.statusText}`);
    }

    const result = await response.json() as T[];
    return result[0];
  }

  async rpc<T>(functionName: string, params: any = {}): Promise<T> {
    const url = `${this.baseUrl}/rest/v1/rpc/${functionName}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": this.apiKey,
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Supabase RPC failed: ${response.statusText}`);
    }

    return await response.json() as T;
  }
}

export const getSupabase = () => new SupabaseClient(supabaseUrl, supabaseKey);
