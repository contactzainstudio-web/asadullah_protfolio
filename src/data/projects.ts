/**
 * All 20 portfolio projects. One entry per Google Drive video.
 *
 * To add a project later: upload the video to Drive (share: "Anyone with the
 * link can view"), add a thumbnail to /public/thumbnails, and append a row to
 * the RAW table below. Nothing else needs to change.
 */

export const CATEGORIES = [
  "Short-Form",
  "Commercials",
  "Cinematic",
  "Gaming & Sports",
  "Podcasts",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type FilterValue = "All Projects" | Category;
export const FILTERS: FilterValue[] = ["All Projects", ...CATEGORIES];

export type Orientation = "vertical" | "horizontal";
/** "featured" cards get a large 2x2 footprint on the "All Projects" view. Horizontal videos are always large. */
export type CardSize = "featured" | "standard";

export interface Project {
  id: number;
  slug: string;
  title: string;
  /** Exact filename in the Google Drive folder. */
  fileName: string;
  driveId: string;
  category: Category;
  /**
   * "reviewed"    = category chosen after looking at a frame of the video.
   * "provisional" = no clear signal from the frame/filename; please confirm.
   */
  categoryBasis: "reviewed" | "provisional";
  orientation: Orientation;
  size: CardSize;
  thumbnail: string;
}

export const previewUrl = (driveId: string) =>
  `https://drive.google.com/file/d/${driveId}/preview`;
export const viewUrl = (driveId: string) =>
  `https://drive.google.com/file/d/${driveId}/view`;

type Row = [
  title: string,
  fileName: string,
  driveId: string,
  slug: string,
  category: Category,
  basis: Project["categoryBasis"],
  orientation: Orientation,
  size: CardSize,
];

const RAW: Row[] = [
  ["Video 1", "viral car edit.mp4", "1Gmjx7jJTJyMCjc48kBIS8fK3flpMolvK", "viral-car-edit", "Short-Form", "reviewed", "vertical", "featured"],
  ["Video 2", "Allura video 1 part 2.mp4", "1WClJxYENZkNy_Fq0niW_ZL6cCWTh_ugm", "allura-video-1-part-2", "Commercials", "reviewed", "vertical", "standard"],
  ["Video 3", "Wedding LU 3.mp4", "1XkGs1RiAFsFkjw-M2JcNgE5VCY-mBCVQ", "wedding-lu-3", "Cinematic", "provisional", "vertical", "standard"],
  ["Video 4", "funny game play-final.mp4", "1-qaBLgRGgUcpoDFUxHUotUkgRrEX3Jzu", "funny-gameplay-final", "Gaming & Sports", "reviewed", "vertical", "standard"],
  ["Video 5", "Apex ad 221.mp4", "12XElohZfUDTktEA025Jiqbx7ulnsucih", "apex-ad-221", "Commercials", "reviewed", "horizontal", "standard"],
  ["Video 6", "Cocospark podcast 4 final.mp4", "1MVbrEn1raO5jEhAv6J4HoeSpI4LyAZt0", "cocospark-podcast-4-final", "Podcasts", "reviewed", "vertical", "standard"],
  ["Video 7", "highlight.mp4", "1JqvTdFe7d6RGDcra0mTP4EjyFjgWqxF4", "highlight", "Short-Form", "provisional", "vertical", "standard"],
  ["Video 8", "virtualconsigner.mp4", "1R-Tr3qXJZKsiiTOpBWDHz6SzXLwp9cxe", "virtualconsigner", "Commercials", "provisional", "vertical", "standard"],
  ["Video 9", "trade.mp4", "1O-8aWxpA0j2ZBRdEDj9cM_jeW5Md_86c", "trade", "Short-Form", "reviewed", "vertical", "standard"],
  ["Video 10", "holiday cottage f.mp4", "1FDqGdQ93jdfCFZRurGVmdIUI-zwiBa1n", "holiday-cottage", "Short-Form", "reviewed", "vertical", "standard"],
  ["Video 11", "venture digital Final.mp4", "1lgcFw3kJsJAu18EvMhIb6X1aE9fhxQQ0", "venture-digital-final", "Short-Form", "reviewed", "vertical", "standard"],
  ["Video 12", "final.mp4", "1TfoDruU2fIEHjUXpnV9xg77E9YfSh6vi", "final", "Other", "provisional", "vertical", "standard"],
  ["Video 13", "mub next final.mp4", "1e-20LNMWAdU6w08K6xJTk6A-gqNjGR5M", "mub-next-final", "Cinematic", "provisional", "vertical", "featured"],
  ["Video 14", "mubashir 4th video.mp4", "15oLcm0wMJGdCi4nLNnZ-Hxe7x-GylENk", "mubashir-4th-video", "Other", "provisional", "vertical", "standard"],
  ["Video 15", "mubashir final video.mp4", "1tMbnj4Ru1A8bsiAOmWHj1jtC655qQb69", "mubashir-final-video", "Other", "provisional", "vertical", "standard"],
  ["Video 16", "photoshop.mp4", "1NTYnwKzMN1TMdzNoAiidD0uQiPBJY3IY", "photoshop", "Other", "provisional", "vertical", "standard"],
  ["Video 17", "new 2.mp4", "1G9KPouEEvCk1S4zMPSUgjQ1z9QZTfTaO", "new-2", "Short-Form", "reviewed", "vertical", "standard"],
  ["Video 18", "0909(3).mp4", "1j0YU-5e9Z4v6avwBmkEZZWAh48XJTfWV", "0909-3", "Other", "provisional", "vertical", "standard"],
  ["Video 19", "0902.mp4", "1pbwZACyC34cOx4rv6uyJ1HeiCvjDeNeL", "0902", "Cinematic", "reviewed", "horizontal", "standard"],
  ["Video 20", "football 2.mp4", "1vuZPF4u3gSgSC-nC-P3GhL4XTKhijVm3", "football-2", "Gaming & Sports", "reviewed", "vertical", "standard"],
];

export const projects: Project[] = RAW.map(
  ([title, fileName, driveId, slug, category, categoryBasis, orientation, size], i) => ({
    id: i + 1,
    slug,
    title,
    fileName,
    driveId,
    category,
    categoryBasis,
    orientation,
    size,
    thumbnail: `/thumbnails/${slug}.webp`,
  }),
);
