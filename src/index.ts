import { Hono } from "hono";
import { loggerMiddleware } from "./middleware/logger";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { stocksRoutes } from "./routes/stocks";
import yahooFinance from "yahoo-finance2";
import { portfolioRouts } from "./routes/portfolio";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono();
app.use(prettyJSON());
app.use(logger());

app.use("*", loggerMiddleware);
app.use("*", errorHandlerMiddleware);

app.route("/api/auth", authRoutes);
app.route("/api/stocks", stocksRoutes);
app.route("/api/portfolio", portfolioRouts);

app.get("/api/indices", async (ctx) => {
  try {
    console.log("Fetching stock quote for selected symbols...");

    // Define the list of symbols
    const symbols = ["HDFCBANK.NS", "TCS.NS", "GME", "TSLA"];

    // Fetch the stock quotes for the symbols
    const indices = await yahooFinance.quote(symbols);

    console.log("Received data:", indices);

    // Send the response
    return ctx.json({
      status: "success",
      data: indices,
      message: "Indices fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching indices:", error);
    return ctx.json(
      {
        status: "error",
        data: null,
        message: "Error fetching indices",
      },
      500
    );
  }
});

// app.get("/api/nseLive", async (ctx) => {
//   try {
//     console.log("Fetching stock quote for HDFCBANK...");

//     // Fetch the stock quote for HDFCBANK
//     const indices = await nseLive.stockQuote("LT");

//     console.log("Received data:", indices);

//     // Send the response
//     return ctx.json({
//       status: "success",
//       data: indices,
//       message: "Indices fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching indices:", error);
//     return ctx.json(
//       {
//         status: "error",
//         data: null,
//         message: "Error fetching indices",
//       },
//       500
//     );
//   }
// });

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

console.log("Server started and is healthy");
export default app;
