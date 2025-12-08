import fs from 'fs';
import { parse } from 'csv-parse';
import { createObjectCsvWriter } from 'csv-writer';
import dayjs from 'dayjs';

// Convert file -> JSON
async function loadCSV(path: string) {
  const text = fs.readFileSync(path);
  return new Promise<any[]>((resolve, reject) => {
    parse(text, { columns: true }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const autoBids = await loadCSV("auto_bids.csv");
  const products = await loadCSV("products.csv");

  const productMap = new Map(products.map(p => [p.id, p]));

  const bids: any[] = [];

  const groups = autoBids.reduce((acc: any, row: any) => {
    const pid = row.product_id;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(row);
    return acc;
  }, {});

  for (const product_id in groups) {
    const group = groups[product_id];
    const p = productMap.get(product_id);
    if (!p) continue;

    let curPrice = Number(p.start_price);
    const step = Number(p.bid_step);
    let bidTime = dayjs().subtract(randInt(5, 20), 'day');
    const endTime = p.end_time ? dayjs(p.end_time) : null;

    const sorted = [...group].sort((a, b) =>
      Number(b.max_price) - Number(a.max_price)
    );

    let count = 0;
    while (true) {
      const best = sorted[0];

      const nextPrice = curPrice + step;
      if (nextPrice > Number(best.max_price)) break;

      bidTime = bidTime.add(randInt(1, 40), 'minute');
      if (endTime && bidTime.isAfter(endTime)) {
        bidTime = endTime.subtract(1, 'minute');
      }

      bids.push({
        id: crypto.randomUUID(),
        product_id,
        bidder_id: best.bidder_id,
        bid_amount: nextPrice,
        bid_time: bidTime.format("YYYY-MM-DD HH:mm:ss")
      });

      curPrice = nextPrice;
      count++;

      if (count >= 6 && Math.random() > 0.6) break;
    }
  }

  const csvWriter = createObjectCsvWriter({
    path: 'bids.csv',
    header: [
      { id: 'id', title: 'id' },
      { id: 'product_id', title: 'product_id' },
      { id: 'bidder_id', title: 'bidder_id' },
      { id: 'bid_amount', title: 'bid_amount' },
      { id: 'bid_time', title: 'bid_time' }
    ]
  });

  await csvWriter.writeRecords(bids);
  console.log("🎉 DONE! Created bids.csv with", bids.length, "rows");
}

main();
