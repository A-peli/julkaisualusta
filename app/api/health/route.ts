/**
 * health check route
 *
 */
import { connectToDatabase } from "@/lib/db/mongodb";

type HealthResponse = {
  status: string;
  uptime: number;
  timestamp: number;
  database?: string;
  error?: string;
};

export async function GET(): Promise<Response> {
  try {
    //Testaa MongoDB-yhteys
    await connectToDatabase();

    const health: HealthResponse = {
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
      database: "connected",
    };

    return Response.json(health, { status: 200 });
  } catch (error) {
    const health: HealthResponse = {
      status: "error",
      uptime: process.uptime(),
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : "Tuntematon virhe",
    };
    return Response.json(health, { status: 500 });
  }
}
