import { Client } from "@elastic/elasticsearch";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "js-yaml";

const elastic = new Client({
  node: process.env.ELASTIC_NODE || "https://localhost:9200",
  auth: { apiKey: process.env.ELASTIC_API_TOKEN || "" },
  tls: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { days } = req.query;
  const range = isNaN(Number(days)) ? "" : `AND resolvedTime: [now-${days}d/d TO now/d]`;

  const welcomers = (
    load(
      await fetch(
        "https://raw.githubusercontent.com/hackclub/slacker/main/config/welcomers.yaml"
      ).then((res) => res.text())
    ) as { maintainers: string[] }
  ).maintainers;

  const welcomes = await elastic.search({
    index: "search-slacker-analytics",
    q: `project:welcomers AND actionItemType:message AND state:resolved ${range}`,
    aggs: {
      by_welcomer: {
        terms: {
          field: "assignee.displayName.enum",
          size: 100,
        },
      },
    },
  });

  const followUp7days = await elastic.search({
    index: "search-slacker-analytics",
    q: `project:welcomers AND actionItemType:followUp AND state:triaged AND followUpDuration: [5760 TO 14400] ${range}`,
    aggs: {
      by_welcomer: {
        terms: {
          field: "assignee.displayName.enum",
          size: 100,
        },
      },
    },
  });

  const followUp30days = await elastic.search({
    index: "search-slacker-analytics",
    q: `project:welcomers AND actionItemType:followUp AND state:triaged AND followUpDuration: [28800 TO 57600] ${range}`,
    aggs: {
      by_welcomer: {
        terms: {
          field: "assignee.displayName.enum",
          size: 100,
        },
      },
    },
  });

  type Bucket = { key: string; doc_count: number };

  const data = (welcomes.aggregations?.by_welcomer as { buckets: Bucket[] }).buckets
    .filter((w) => welcomers.includes(w.key))
    .map((welcomer) => ({
      id: welcomer.key,
      initial: welcomer.doc_count,
      sevenDays:
        (followUp7days.aggregations?.by_welcomer as { buckets: Bucket[] }).buckets.find(
          (bucket) => bucket.key === welcomer.key
        )?.doc_count || 0,
      Thirtydays:
        (followUp30days.aggregations?.by_welcomer as { buckets: Bucket[] }).buckets.find(
          (bucket) => bucket.key === welcomer.key
        )?.doc_count || 0,
    }));

  return res.status(200).json(data);
}
