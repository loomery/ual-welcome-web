import Link from 'next/link';

export const metadata = {
  title: 'Page not found | UAL Welcome Week',
};

export default function NotFound() {
  return (
    <article className="prose has-lead flow" data-flow="l">
      <div className="flow" data-flow="s">
        <h1>Page not found</h1>
        <p className="standfirst">We couldn’t find what you were looking for.</p>
      </div>
      <p>
        <Link href="/" className="button" data-ghost-button="">
          Back to home
        </Link>
      </p>
    </article>
  );
}
