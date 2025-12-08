import fs from 'fs';
import { parse } from 'csv-parse';
import { createObjectCsvWriter } from 'csv-writer';

// Load CSV helper
async function loadCSV(path: string) {
  const text = fs.readFileSync(path);
  return new Promise<any[]>((resolve, reject) => {
    parse(text, { columns: true }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function main() {
  const products = await loadCSV("products.csv");
  const bids = await loadCSV("bids.csv");

  // Highest bid per product
  const bestMap = new Map<string, any>();

  for (const bid of bids) {
    const pid = bid.product_id;
    const amount = Number(bid.bid_amount);

    if (!bestMap.has(pid) || amount > Number(bestMap.get(pid).bid_amount)) {
      bestMap.set(pid, bid);
    }
  }

  // Update product fields
  for (const p of products) {
    const best = bestMap.get(p.id);
    if (best) {
      p.current_price = best.bid_amount;
      p.highest_bidder_id = best.bidder_id;
    }
  }

  const csvWriter = createObjectCsvWriter({
    path: 'products_updated.csv',
    header: Object.keys(products[0]).map(k => ({ id: k, title: k }))
  });

  await csvWriter.writeRecords(products);
  console.log("🎉 DONE! Created products_updated.csv with updated prices & winners.");
}

main();
