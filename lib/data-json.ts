import { promises as fs } from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type { NewReviewInput, Review } from "@/lib/types";
import { seedReviews } from "@/data/reviews.seed";
import type { DataAdapter } from "@/lib/data-adapter";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reviews.json");

let memoryCache: Review[] | null = null;

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(seedReviews, null, 2),
      "utf8",
    );
  }
}

async function readAll(): Promise<Review[]> {
  if (memoryCache) return memoryCache;
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as Review[];
    memoryCache = parsed;
    return parsed;
  } catch {
    memoryCache = [...seedReviews];
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(memoryCache, null, 2),
      "utf8",
    );
    return memoryCache;
  }
}

async function writeAll(rows: Review[]): Promise<void> {
  memoryCache = rows;
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export const jsonAdapter: DataAdapter = {
  async list(opts) {
    const rows = await readAll();
    const filtered =
      !opts?.status || opts.status === "all"
        ? rows
        : rows.filter((r) => r.status === opts.status);
    return [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
  },
  async get(id) {
    const rows = await readAll();
    return rows.find((r) => r.id === id) ?? null;
  },
  async create(input: NewReviewInput) {
    const rows = await readAll();
    const newRow: Review = {
      ...input,
      id: nanoid(10),
      status: input.status ?? "pending",
      submittedAt: new Date().toISOString(),
    };
    await writeAll([newRow, ...rows]);
    return newRow;
  },
  async setStatus(id, status) {
    const rows = await readAll();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return null;
    const next: Review = { ...rows[idx], status };
    rows[idx] = next;
    await writeAll(rows);
    return next;
  },
  async remove(id) {
    const rows = await readAll();
    const next = rows.filter((r) => r.id !== id);
    if (next.length === rows.length) return false;
    await writeAll(next);
    return true;
  },
};
