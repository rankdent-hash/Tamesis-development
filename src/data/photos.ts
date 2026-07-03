// All IDs below are free-tier Unsplash photos (images.unsplash.com/photo-...),
// never Unsplash+ (plus.unsplash.com) or iStock — those require a paid license.
// The Unsplash License permits free commercial use with no attribution required:
// https://unsplash.com/license
//
// These are generic trade/property photos representing the *type* of work,
// not actual photos of Tamesis's team or projects. Replace with real company
// photography when available — see README.

export function unsplashUrl(photoId: string, params = "auto=format&fit=crop&q=80&w=1600") {
  return `https://images.unsplash.com/${photoId}?${params}`;
}

export const heroPhoto = "photo-1632862378103-8248dccb7e3d"; // team collaborating on a project

export const aboutPhoto = "photo-1672748341520-6a839e6c05bb"; // engineer in hard hat and workwear

export const coveragePhoto = "photo-1513635269975-59663e0ac1ad"; // aerial London skyline (The Shard)

// Keyed by exact project title (from `projects` in content.ts)
export const projectPhotos: Record<string, string> = {
  "Void Turnaround Programme": "photo-1516216628859-9bccecab13ca",
  "Full Bathroom Refurbishment": "photo-1643949719317-4342d8d4031e",
  "Estate-Wide Planned Maintenance": "photo-1541888946425-d81bb19240f5",
  "Commercial Office Refit": "photo-1694521787193-9293daeddbaa",
  "Insurance Reinstatement Works": "photo-1558227691-41ea78d1f631",
  "Multi-Unit Roof & Leak Repairs": "photo-1530124566582-a618bc2615dc",
  "Ensuite Bathroom Installation": "photo-1661107259637-4e1c55462428",
  "Retail Unit Fit-Out": "photo-1695721157873-0c87f59a8ea1",
  "Estate Extension & Groundworks": "photo-1574757987642-5755f0839101",
  "Emergency Leak Response": "photo-1558618666-fcd25c85cd64",
  "Block Communal Area Refurbishment": "photo-1620653713380-7a34b773fef8",
  "New-Build Internal Fit-Out": "photo-1659930087003-2d64e33181f7",
};

// Keyed by exact article title (from `news` in content.ts)
export const newsPhotos: Record<string, string> = {
  "Tamesis Expands Planned Maintenance Team": "photo-1541888946425-d81bb19240f5",
  "A Guide to Preventing Winter Leaks in Occupied Properties": "photo-1542013936693-884638332954",
  "How We Deliver Void Turnarounds Faster": "photo-1513692398020-cbaea622c427",
};

export const servicePhotos: Record<string, string> = {
  "responsive-repairs": "photo-1621905252507-b35492cc74b4",
  "property-maintenance": "photo-1690473768476-44b5cebb7d80",
  plumbing: "photo-1749532125405-70950966b0e5",
  "leak-detection": "photo-1669920282730-ab422e592f97",
  "drain-unblocking": "photo-1521207418485-99c705420785",
  "drain-repairs": "photo-1530124566582-a618bc2615dc",
  "bathroom-repairs": "photo-1631889993959-41b4e9c6e3c5",
  "bathroom-installation": "photo-1695002817411-203c7f19dfa3",
  "bathroom-refurbishment": "photo-1620626011761-996317b8d101",
  "flooring-repairs": "photo-1659930087003-2d64e33181f7",
  tiling: "photo-1629079447777-1e605162dc8d",
  "carpentry-joinery": "photo-1561297331-a9c00b9c2c44",
  "painting-decorating": "photo-1632918572888-7a975f4b67b6",
  electrical: "photo-1621905251189-08b45d6a269e",
  "damp-mould": "photo-1517646287270-a5a9ca602e5c",
  "planned-maintenance": "photo-1516216628859-9bccecab13ca",
  "void-refurbishment": "photo-1587582423116-ec07293f0395",
  "insurance-reinstatement": "photo-1558227691-41ea78d1f631",
  "commercial-refurbishment": "photo-1694521787193-9293daeddbaa",
  construction: "photo-1574757987642-5755f0839101",
};
