import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>React Server Components + Actions API example</h1>
      <ul>
        <li>
          <Link href="/products">Products</Link> — Server Component + Client
          Component calling a Server Action via <code>useTransition</code>
        </li>
        <li>
          <Link href="/profile">Profile</Link> — form bound to a Server Action
          via <code>useActionState</code>
        </li>
      </ul>
    </main>
  );
}
