import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rove")({
  component: RovePage,
});

function RovePage() {
  return (
    <iframe
      title="Rove Map"
      src="/rove-app/index.html"
      className="block h-full w-full border-0 bg-[#0e1410]"
    />
  );
}
