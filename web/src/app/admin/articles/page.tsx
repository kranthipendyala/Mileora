"use client";

import Link from "next/link";
import { ARTICLES } from "@/lib/mock-data";

export default function AdminArticles() {
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Articles</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Manage the blog — drafts, scheduling, SEO.</p>
        </div>
        <button type="button" className="rounded-md bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-400">
          + New article
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {ARTICLES.map((a) => (
              <tr key={a.slug} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 text-[color:var(--color-text)]">{a.title}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-2 py-0.5 text-xs text-[color:var(--color-text-muted)]">{a.category}</span>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{a.author}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{a.publishedAt}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/blog/${a.slug}`} className="text-xs text-[color:var(--color-gold-100)] underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
