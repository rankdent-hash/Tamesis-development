export interface HouseService {
  name: string;
  href: string;
  /** Short line shown under the name while this service is active */
  blurb: string;
  /** Where on the house this service applies, in plain words */
  location: string;
  /** Hotspot marker position [x, y, z] */
  marker: [number, number, number];
  /** Camera position when this service is active */
  camera: [number, number, number];
  /** What the camera looks at */
  target: [number, number, number];
}

/**
 * Deliberately does NOT include roofing. Tamesis doesn't offer roofing as a
 * service — it appears on the site only as "roof and external water ingress
 * investigations" within Leak Detection, and "roofing" is an active negative
 * keyword on the Google Ads account. Showing a roofing hotspot would
 * advertise something the business doesn't do.
 */
export const houseServices: HouseService[] = [
  {
    name: "Plumbing & Drainage",
    href: "/services/plumbing",
    blurb: "Leaks, blockages and emergency call-outs",
    location: "Soil pipe & drainage",
    marker: [2.95, 2, 1.65],
    camera: [11.36, 4.93, 6.49],
    target: [2.2, 1.9, 1.2],
  },
  {
    name: "Bathroom & Kitchen",
    href: "/services/bathroom-refurbishment",
    blurb: "Full refurbishment and installation",
    location: "First floor bathroom",
    marker: [1.72, 2.55, 2.2],
    camera: [5.57, 4.48, 10.15],
    target: [1.5, 2.5, 1.8],
  },
  {
    name: "Electrical Services",
    href: "/services/electrical",
    blurb: "Fault finding, rewiring and EICR certificates",
    location: "Throughout the property",
    marker: [-1.72, 1.15, 2.2],
    camera: [1.16, 5.17, 11.99],
    target: [0, 2.0, 1.0],
  },
  {
    name: "Wall & Floor Tiling",
    href: "/services/tiling",
    blurb: "Wet rooms, bathrooms and splashbacks",
    location: "Bathroom & kitchen",
    marker: [-1.72, 2.55, 2.2],
    camera: [-5.28, 4.48, 10.29],
    target: [-1.5, 2.5, 1.8],
  },
  {
    name: "Carpentry & Joinery",
    href: "/services/carpentry-joinery",
    blurb: "Doors, skirting and fitted storage",
    location: "Doors & internal joinery",
    marker: [0, 1.5, 2.25],
    camera: [1.95, 3.15, 10.75],
    target: [0, 1.5, 1.6],
  },
  {
    name: "Painting & Decorating",
    href: "/services/painting-decorating",
    blurb: "Interior and exterior, properly prepared",
    location: "Interior & exterior walls",
    marker: [-0.9, 1.9, 2.15],
    camera: [3.11, 6.3, 11.64],
    target: [0, 2.2, 0.8],
  },
  {
    name: "Damp & Mould",
    href: "/services/damp-mould",
    blurb: "Diagnosis first, then the right treatment",
    location: "Ground floor walls",
    marker: [-2.9, 0.8, 0.2],
    camera: [-12.51, 3.49, 3.68],
    target: [-2.4, 1.2, 0],
  },
  {
    name: "Fencing & External",
    href: "/services/fencing-external-repairs",
    blurb: "Garden fencing, gates and external repairs",
    location: "Garden & boundary",
    marker: [1.6, 1.2, 6.4],
    camera: [1.96, 4.32, 13.99],
    target: [0.2, 1.6, 4.0],
  },
];
