import { http, HttpResponse } from "msw";

export const handlers = [
  // Mempool API - address balance
  http.get("https://mempool.space/api/address/:address", ({ params }) => {
    const { address } = params;
    // Return mock balance data
    return HttpResponse.json({
      address,
      chain_stats: {
        funded_txo_count: 10,
        funded_txo_sum: 500000, // 0.005 BTC in sats
        spent_txo_count: 5,
        spent_txo_sum: 250000,
      },
      mempool_stats: {
        funded_txo_count: 0,
        funded_txo_sum: 0,
        spent_txo_count: 0,
        spent_txo_sum: 0,
      },
    });
  }),

  // Mempool API - BTC price
  http.get("https://mempool.space/api/v1/prices", () => {
    return HttpResponse.json({
      USD: 96000,
      EUR: 88000,
      GBP: 76000,
    });
  }),

  // Emily API - limits
  http.get("*/api/emilyDeposit", () => {
    return HttpResponse.json({
      pegCap: 100000000000, // 1000 BTC in sats
      perDepositCap: 10000000, // 0.1 BTC in sats
      perDepositMinimum: 10000, // 0.0001 BTC in sats
    });
  }),
];
