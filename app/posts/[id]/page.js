import PostDetails from "@/components/PostDetails";

export default async function PostPage({ params }) {
  const { id } = await params;
  return <section className="px-4 py-12 sm:px-6"><PostDetails id={id} /></section>;
}
