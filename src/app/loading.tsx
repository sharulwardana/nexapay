export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] overflow-hidden bg-primary/10 pointer-events-none">
      <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-pulse w-full" />
    </div>
  );
}
