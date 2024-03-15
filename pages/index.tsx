import { Shrikhand } from "next/font/google";
import { orderBy } from "lodash";
import { useEffect, useState } from "react";

const shrikhand = Shrikhand({ subsets: ["latin"], weight: "400" });
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [users, setUsers] = useState<
    { id: string; initial: number; misc: number; sevenDays: number; thirtyDays: number }[]
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

      {/* <table className="w-full max-w-xl rounded-lg bg-gray-100 border-gray-300 border-2 text-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">0</th>
            <th className="py-2 px-4 border-b">&lt;5</th>
            <th className="py-2 px-4 border-b">7</th>
            <th className="py-2 px-4 border-b">30</th>
          </tr>
        </thead>
        <tbody>
          {orderBy(users, "initial", "desc").map((u, i) => (
            <tr key={u.id} className={`${i === users.length - 1 ? "" : "border-b"}`}>
              <td className="py-2 px-4">{u.id}</td>
              <td className="py-2 px-4">{u.initial}</td>
              <td className="py-2 px-4">{u.misc}</td>
              <td className="py-2 px-4">{u.sevenDays}</td>
              <td className="py-2 px-4">{u.Thirtydays}</td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <div className="inline-block w-full max-w-3xl py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 sm:pl-6">
                  User
                </th>
                <th className="px-3 py-3.5 text-left font-semibold text-gray-900">0</th>
                <th className="px-3 py-3.5 text-left font-semibold text-gray-900">&lt;5</th>
                <th className="px-3 py-3.5 text-left font-semibold text-gray-900">7</th>
                <th className="px-3 py-3.5 text-left font-semibold text-gray-900">30</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orderBy(users, "initial", "desc").map((u) => (
                <tr key={u.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 font-medium text-gray-900 sm:pl-6">
                    {u.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{u.initial}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{u.misc}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{u.sevenDays}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{u.thirtyDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
