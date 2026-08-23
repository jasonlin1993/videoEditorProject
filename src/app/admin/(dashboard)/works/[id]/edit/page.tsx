export default async function AdminWorkEditPage({
  params,
}: PageProps<"/admin/works/[id]/edit">) {
  const { id } = await params;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">編輯作品</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        /admin/works/{id}/edit
      </p>
    </>
  );
}
