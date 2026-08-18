import { Parser } from "@json2csv/plainjs";

export function toCsv<T extends Record<string, unknown>>(data: T[]): string {
  if (!data.length) return "";
  const parser = new Parser();
  return parser.parse(data);
}