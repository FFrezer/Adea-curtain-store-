export interface Order {
  id: string;
  createdAt: string | Date;
  name?: string;
  branch: string; // matches DB string
  total: number;
  status: "PENDING" | "CONFIRMED" | "DELIVERED";
  email?: string;
  address?: string;
  images?: any; // JsonValue from Prisma
}

export interface CardProps {
  title: string;
  value: string | number;
}