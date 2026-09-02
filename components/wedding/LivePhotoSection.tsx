import LivePhoto from "./LivePhoto";
import { livePhotos } from "@/lib/data";

// Section galeri ala Apple Live Photo: hover (desktop) / tekan-tahan (mobile) → klip pendek main.
export default function LivePhotoSection() {
  if (!livePhotos.length) return null;

  return (
    <section className="relative w-full px-6 py-24 text-[#52363E]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="text-[0.64rem] uppercase tracking-[0.32em]">
            Live Moments
          </p>
          <h2 className="mt-2 font-serif text-3xl">Photo Gallery</h2>
          <p className="mx-auto mt-2 max-w-sm text-[0.72rem] leading-loose opacity-70">
            Arahkan kursor atau tekan &amp; tahan tiap foto untuk
            menghidupkannya.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {livePhotos.map((p) => (
            <LivePhoto
              key={p.id}
              src={p.src}
              live={p.live}
              alt={p.alt}
              width={p.width}
              height={p.height}
              className="aspect-[4/5] rounded-xl shadow-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
