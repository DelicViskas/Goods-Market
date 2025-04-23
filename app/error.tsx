'use client'

export default function ErrorPage({ error }: { error: Error }) {
  return <div className="error">
    <p>{error.message}</p>
  </div>;
}