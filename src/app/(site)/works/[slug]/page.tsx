export default async function WorkDetailPage({
  params,
}: PageProps<"/works/[slug]">) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">作品詳情</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        /works/{slug}
      </p>
    </main>
  );
}
