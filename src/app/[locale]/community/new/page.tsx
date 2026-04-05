import { PostForm } from "@/components/community/PostForm";

type Params = { locale: string };

export default async function NewPostPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const title = locale === "ko" ? "글쓰기" : locale === "zh" ? "发布帖子" : "Write Post";

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
      <h1 className="text-lg font-semibold text-[var(--fg)] mb-4">{title}</h1>
      <PostForm />
    </div>
  );
}
