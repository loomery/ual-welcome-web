import { Button } from '../components/Button/Button';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <h1>Page not found</h1>
        <p className="text-step-1 text-ual-medium">We couldn’t find what you were looking for.</p>
      </div>
      <p>
        <Button href="/" variant="ghost">
          Back to home
        </Button>
      </p>
    </article>
  );
}
