import { Client } from "@elastic/elasticsearch";
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "js-yaml";

const elastic = new Client({
  node: process.env.ELASTIC_NODE || "https://localhost:9200",
  auth: { apiKey: process.env.ELASTIC_API_TOKEN || "" },
  tls: { rejectUnauthorized: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = load(
    await fetch(
      "https://raw.githubusercontent.com/hackclub/slacker/main/config/welcomers.yaml"
    ).then((res) => res.text())
  ) as { maintainers: string[] };

  const maintainers = load(
    await fetch("https://raw.githubusercontent.com/hackclub/slacker/main/maintainers.yaml").then(
      (res) => res.text()
    )
  ) as { id: string }[];

  const welcomers = maintainers.filter((maintainer) => config.maintainers.includes(maintainer.id));

  const data: any[] = [];

  for await (const welcomer of welcomers) {
    const welcomes = await elastic.count({
      index: "search-slacker-analytics",
      q: `project:welcomers AND actionItemType:message AND state:resolved AND assignee.displayName:${welcomer.id}`,
    });

    const followUp7days = await elastic.count({
      index: "search-slacker-analytics",
      q: `project:welcomers AND actionItemType:followUp AND state:triaged AND assignee.displayName:${welcomer.id} AND followUpDuration: [5760 TO 14400]`,
    });

    const followUp30days = await elastic.count({
      index: "search-slacker-analytics",
      q: `project:welcomers AND actionItemType:followUp AND state:triaged AND assignee.displayName:${welcomers[6].id} AND followUpDuration: [28800 TO 57600]`,
    });

    data.push({
      id: welcomer.id,
      initial: welcomes.count,
      sevenDays: followUp7days.count,
      Thirtydays: followUp30days.count,
    });
  }

  return res.status(200).json(data);
}
