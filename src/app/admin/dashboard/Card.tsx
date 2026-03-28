import { CardProps } from "@/lib/types";

export default function Card({ title, value }: CardProps) {
  return (
    <div className="border p-4 rounded-xl shadow bg-white">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-lg md:text-xl font-bold">{value}</h2>
    </div>
  );
}