import { cn } from "@/lib/utils";

export function PhoneFrame({
  os,
  caption,
  src,
  className,
}: {
  os: "ios" | "android";
  caption?: string;
  src: string;
  className?: string;
}) {
  const android = os === "android";
  return (
    <figure className={cn("mx-auto w-full", className)}>
      <div
        className={cn(
          "relative border-8 border-ink bg-ink p-1 shadow-soft",
          android ? "rounded-device-android" : "rounded-device",
        )}
      >
        <div
          className={cn(
            "absolute z-10 bg-ink",
            android
              ? "top-2 left-1/2 size-2.5 -translate-x-1/2 rounded-full"
              : "top-2 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full",
          )}
        />
        <div className={cn("overflow-hidden bg-background", android ? "rounded-lg" : "rounded-device-inner")}>
          <img src={src} alt="" className="aspect-phone block w-full object-cover object-top" />
        </div>
        <div className="mx-auto mt-1 mb-0.5 h-1 w-16 rounded-full bg-card/50" />
      </div>
      {caption ? <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}

export function PhoneDuo({
  iosSrc,
  androidSrc,
}: {
  iosSrc: string;
  androidSrc: string;
}) {
  return (
    <div className="flex items-end justify-center">
      <div className="relative z-10 -mr-10 w-40 shrink-0 sm:w-44 md:w-52">
        <PhoneFrame os="ios" src={iosSrc} />
      </div>
      <div className="relative z-20 mb-8 w-40 shrink-0 sm:w-44 md:w-52">
        <PhoneFrame os="android" src={androidSrc} />
      </div>
    </div>
  );
}
