import { Shrikhand } from "next/font/google";
import { orderBy } from "lodash";
import { useEffect, useState } from "react";

const shrikhand = Shrikhand({ subsets: ["latin"], weight: "400" });
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [users, setUsers] = useState<
    { id: string; initial: number; sevenDays: number; Thirtydays: number }[]
  >([]);
  const [tabs, setTabs] = useState([
    { name: "All time", current: true, value: undefined },
    { name: "Last 7 Days", current: false, value: 7 },
    { name: "Last two weeks", current: false, value: 14 },
    { name: "Last month", current: false, value: 30 },
    { name: "First of month to date", current: false, value: new Date().getDate() },
  ]);

  useEffect(() => {
    fetch(`/api/users?days=${tabs.find((t) => t.current)?.value}`)
      .then((res) => res.json())
      .then(setUsers);
  }, [tabs]);

  return (
    <main className={`flex flex-col items-center min-h-screen bg-[#f5f5f4] ${shrikhand.className}`}>
      <h1 className="text-5xl font-bold text-center mt-8 mb-6 text-gray-700">
        Who's welcoming the most people?
      </h1>

      <nav className="flex space-x-4 mb-2" aria-label="Tabs">
        {tabs.map((t) => (
          <button
            className={classNames(
              t.current ? "bg-gray-200 text-gray-700" : "text-gray-500 hover:text-gray-700",
              "rounded-md px-3 py-2 text-sm font-medium"
            )}
            key={t.name}
            onClick={() =>
              setTabs((prev) => prev.map((p) => ({ ...p, current: p.name === t.name })))
            }
          >
            {t.name}
          </button>
        ))}
      </nav>

      <div className="flex flex-col max-w-xl w-full rounded-lg bg-gray-100 border-gray-300 border-2 text-gray-800">
        {orderBy(users, "initial", "desc").map((u, i) => (
          <div
            key={u.id}
            className={`flex items-center gap-2 justify-between text-xl p-4 ${
              i === users.length - 1 ? "" : "border-b"
            }`}
          >
            <p>{u.id}</p>
            <div className="flex items-center gap-2">
              <p>{u.initial}&nbsp;🔥</p>
              <div className="w-0.5 h-6 bg-gray-300" />
              <p>{u.sevenDays}&nbsp;🔥</p>
              <div className="w-0.5 h-6 bg-gray-300" />
              <p>{u.Thirtydays}&nbsp;🔥</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
