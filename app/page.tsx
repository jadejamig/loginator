import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1>Welcome to my application!</h1>
      <Link href='/dashboard' className="text-blue-400">{`Continue ->`}</Link>
    </div>
  );
}
