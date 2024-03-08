import { Shrikhand } from "next/font/google";
import { orderBy } from "lodash";
import { useEffect, useState } from "react";

const shrikhand = Shrikhand({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const [users, setUsers] = useState<
    { id: string; initial: number; sevenDays: number; Thirtydays: number }[]
  >([]);

  useEffect(() => {
    if (users.length > 0) return;

    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <main className={`flex flex-col items-center min-h-screen bg-[#f5f5f4] ${shrikhand.className}`}>
      <h1 className="text-5xl font-bold text-center mt-8 mb-6 text-gray-700">
        Who's welcoming the most people?
      </h1>
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
