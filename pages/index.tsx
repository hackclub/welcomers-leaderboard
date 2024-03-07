import { Shrikhand } from "next/font/google";
import { orderBy } from "lodash";

const shrikhand = Shrikhand({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const users = [
    { id: 1, username: "Faisal Sayed", maxStreaks: 12 },
    { id: 1, username: "Kara Massie", maxStreaks: 5 },
    { id: 1, username: "Shawn Malluwa-Wadu", maxStreaks: 10 },
  ];

  return (
    <main className={`flex flex-col items-center min-h-screen bg-[#f5f5f4] ${shrikhand.className}`}>
      <h1 className="text-5xl font-bold text-center mt-8 mb-6 text-gray-700">
        Who's got the highest streak?
      </h1>
      <div className="flex flex-col max-w-xl w-full rounded-lg bg-gray-100 border-gray-300 border-2 text-gray-800">
        {orderBy(users, "maxStreaks", "desc").map((u, i) => (
          <div
            key={u.id}
            className={`flex items-center gap-2 justify-between text-xl p-4 ${
              i === users.length - 1 ? "" : "border-b"
            }`}
          >
            <p>{u.username}</p>
            <p>{u.maxStreaks}&nbsp;🔥</p>
          </div>
        ))}
      </div>
    </main>
  );
}
