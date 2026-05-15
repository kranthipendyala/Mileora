import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ChevronLeft } from "lucide-react";
import { buildMetadata, SITE } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { ARTICLES } from "@/lib/mock-data";
import { siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return buildMetadata({ title: "Article not found", path: `/blog/${slug}`, noindex: true });
  return buildMetadata({
    title: a.title,
    description: a.excerpt,
    path: `/blog/${a.slug}`,
    image: a.cover,
    type: "article",
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    image: a.cover,
    author: { "@type": "Person", name: a.author },
    publisher: { "@type": "Organization", name: SITE.name, url: siteUrl(), logo: { "@type": "ImageObject", url: siteUrl("/icons/icon-512.png") } },
    datePublished: a.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(`/blog/${a.slug}`) },
  };

  const others = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 2);

  return (
    <div className="bg-cosmic">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: a.title, path: `/blog/${a.slug}` },
          ]),
          articleLd,
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-14">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold-100)]">
          <ChevronLeft className="h-4 w-4" aria-hidden /> Back to blog
        </Link>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{a.category}</p>
        <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl leading-tight tracking-tight sm:text-5xl">{a.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[color:var(--color-text-muted)]">
          <span>{a.author}</span>
          <span>·</span>
          <span>{fmtDate(a.publishedAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {a.readMinutes} min read</span>
        </div>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
          <Image src={a.cover} alt={a.title} fill priority sizes="(min-width:1024px) 768px, 100vw" className="object-cover" />
        </div>

        <div className="prose-mileora mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: a.body }} />

        <div className="mt-12 flex flex-wrap gap-2">
          {a.tags.map((t) => (
            <span key={t} className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-3 py-1 text-xs text-[color:var(--color-text-muted)]">
              #{t}
            </span>
          ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="border-t border-[color:var(--color-border)]/60 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Continue reading</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/blog/${o.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 transition-all hover:-translate-y-1 hover:border-[color:var(--color-gold-500)]/60"
                >
                  <div className="relative aspect-[16/10]">
                    <Image src={o.cover} alt={o.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{o.category}</p>
                    <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl">{o.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .prose-mileora h2 { font-family: var(--font-cormorant), Georgia, serif; font-size: 1.875rem; color: var(--color-text); margin-top: 2.25rem; margin-bottom: 0.5rem; }
        .prose-mileora h3 { font-size: 1.05rem; font-weight: 600; color: var(--color-gold-100); margin-top: 1.5rem; margin-bottom: 0.4rem; }
        .prose-mileora p { color: var(--color-text); opacity: 0.92; line-height: 1.8; margin-bottom: 1rem; font-size: 1.0625rem; }
        .prose-mileora a { color: var(--color-gold-100); text-decoration: underline; }
        .prose-mileora em { color: var(--color-gold-100); font-style: italic; }
      `}</style>
    </div>
  );
}
