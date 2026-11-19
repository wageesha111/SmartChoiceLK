# Product videos (Google Flow) — how to add them

Every product page can show a video. When a customer opens a product:

1. **The video plays first** inside the photo box (muted, inline). When it ends, the box moves on to the photos. A ▶ thumbnail lets them watch it again.
2. **"See inside"** — further down the page the same video is tied to the scroll: as the customer scrolls, the product comes apart part by part, with a caption for each part (front panel, filter, coil, fan, board…). Scrolling back puts it together again.

If a product has no video, the page looks exactly as before.

## 1. Photos to start from (important)

Use photos you have the right to use:

- **Your own photos** of the units in the shop (best — real stock, real colours), or
- **Official images from the brand / local distributor** (ask your LG, Samsung, Panasonic… distributor for their dealer media kit — dealers are usually given these for their websites).

Don't download photos or text from other shops' websites (e.g. Buyabans, Singer, Abans): they are copyrighted by those companies. Product facts such as model number, BTU, capacity, energy rating and features are fine to write in your own words.

## 2. Make the video in Google Flow

Recommended settings: **landscape 16:9, 8 seconds, clean studio background**, one product per video. Upload the product photo as the starting frame ("Frames to Video" / image-to-video), then use a prompt like the ones below. Keep the camera still — the "See inside" section works best when only the parts move.

### Air conditioner (indoor split unit)
> Studio product shot of this wall-mounted inverter air conditioner indoor unit on a dark navy background with soft blue rim light. The camera stays still. Slowly, the unit separates into an exploded view, one part at a time, in this order: the front panel lifts forward, the dust filter slides out, the copper-and-aluminium evaporator coil moves forward, the long cross-flow fan slides out below it, and finally the inverter control circuit board lifts out at the side. Each part floats apart with small even gaps, clean and precise, like a technical product animation. No text, no people, no logos added.

### Refrigerator
> Studio product shot of this refrigerator on a dark navy background with soft blue rim light, camera still. The doors open and float forward slightly, then the glass shelves and crisper drawers slide out one by one, the internal airflow vents glow faintly blue, and finally the inverter compressor at the bottom back is revealed. Clean exploded-view product animation, even spacing, no text, no people.

### Washing machine (front load)
> Studio product shot of this front-load washing machine on a dark navy background with soft blue rim light, camera still. The door and control panel separate forward, the stainless steel drum slides out, the direct-drive motor behind it is revealed, and finally the drain pump and filter at the bottom. Clean exploded-view product animation, even spacing, no text, no people.

### TV
> Studio product shot of this flat-screen TV on a dark navy background with soft blue rim light, camera still. The layers separate front to back like an exploded view: the screen panel, the backlight and colour layers, the processor board, and the speakers and stand. Clean technical product animation, even spacing, no text, no people.

Tip: if Flow changes the product's look, regenerate — the product must look like the real model you sell.

## 3. Prepare the file (for smooth scrolling)

Videos that are scrubbed by scrolling need a keyframe on every frame. Run this once per video (needs ffmpeg):

```bash
ffmpeg -i flow-download.mp4 -c:v libx264 -g 1 -crf 23 -pix_fmt yuv420p -an -movflags +faststart public/videos/lg-dualcool-12000.mp4
ffmpeg -i public/videos/lg-dualcool-12000.mp4 -frames:v 1 public/videos/lg-dualcool-12000.jpg
```

The second line saves the first frame as the poster image. Keep each video under ~8–10 MB.

## 4. Connect it to the product

In `src/data/products.ts`, add a `video` line to the product:

```ts
{
  id: 1,
  name: 'LG DUALCOOL 12,000 BTU Dual Inverter Smart Air Conditioner',
  // ...
  video: { src: '/videos/lg-dualcool-12000.mp4', poster: '/videos/lg-dualcool-12000.jpg' },
},
```

The "See inside" captions come from the defaults for the product's category (`src/lib/productVideo.ts`), timed to the order in the prompts above. If a video shows the parts at different moments, give the product its own captions:

```ts
video: {
  src: '/videos/lg-dualcool-12000.mp4',
  parts: [
    { at: 0.1, title: 'Front panel', text: '…' },  // at = 0–1, how far through the video
    { at: 0.4, title: 'Filter', text: '…' },
  ],
},
```
