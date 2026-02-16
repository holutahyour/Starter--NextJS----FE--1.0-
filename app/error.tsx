"use client";

export default function Error() {
  return (
    <main className="grid justify-center items-center my-auto flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      {/* <p className="text-lg">{error.message}</p> */}

      <button
        className="inline-block bg-accent-500 text-primary px-6 py-3 text-[1.6rem]"
        // onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
