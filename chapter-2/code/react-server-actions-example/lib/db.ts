// Not shown in the book excerpt — a tiny in-memory stand-in for the Prisma
// client (`db.product.findMany`, `db.user.update`) the book's snippets call,
// so the Server Component / Server Action code can run without a real database.

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface User {
  id: string;
  displayName: string;
}

const products: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 79.99 },
  { id: 2, name: "Mechanical Keyboard", price: 129.0 },
  { id: 3, name: "USB-C Hub", price: 39.5 },
];

const users: Record<string, User> = {
  "user-1": { id: "user-1", displayName: "Ada Lovelace" },
};

export const db = {
  product: {
    async findMany({ orderBy }: { orderBy: { name: "asc" | "desc" } }) {
      const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));
      return orderBy.name === "asc" ? sorted : sorted.reverse();
    },
  },
  user: {
    async find(id: string) {
      return users[id];
    },
    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: { displayName: string };
    }) {
      const user = users[where.id];
      if (!user) throw new Error("user not found");
      user.displayName = data.displayName;
      return user;
    },
  },
};
