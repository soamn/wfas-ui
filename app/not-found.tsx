import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <a href="/">
        <Image
          src="/wfas_logo.svg"
          alt="WFAS Logo"
          width={500}
          height={500}
          className="object-cover "
        />{" "}
      </a>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500">Page not found</p>
    </div>
  );
}
