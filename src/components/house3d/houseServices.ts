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
    marker: [2.35, 1.5, -0.55],
    camera: [10.31, 4.99, 4.63],
    target: [1.6, 1.4, 0],
  },
  {
    name: "Bathroom & Kitchen",
    href: "/services/bathroom-refurbishment",
    blurb: "Full refurbishment and installation",
    location: "First floor bathroom",
    marker: [1.25, 1.72, 1.88],
    camera: [4.96, 4.18, 8.84],
    target: [0.9, 1.7, 1.2],
  },
  {
    name: "Electrical Services",
    href: "/services/electrical",
    blurb: "Fault finding, rewiring and EICR certificates",
    location: "Throughout the property",
    marker: [-1.25, 0.82, 1.88],
    camera: [1.39, 4.74, 10.49],
    target: [0, 1.5, 0.6],
  },
  {
    name: "Wall & Floor Tiling",
    href: "/services/tiling",
    blurb: "Wet rooms, bathrooms and splashbacks",
    location: "Bathroom & kitchen",
    marker: [-1.25, 1.72, 1.88],
    camera: [-4.79, 4.18, 8.98],
    target: [-1, 1.7, 1.2],
  },
  {
    name: "Carpentry & Joinery",
    href: "/services/carpentry-joinery",
    blurb: "Doors, skirting and fitted storage",
    location: "Doors & internal joinery",
    marker: [1.25, 1.55, 1.92],
    camera: [4.2, 2.49, 8.7],
    target: [1.25, 1.1, 1.4],
  },
  {
    name: "Painting & Decorating",
    href: "/services/painting-decorating",
    blurb: "Interior and exterior, properly prepared",
    location: "Interior & exterior walls",
    marker: [0, 2.05, 1.88],
    camera: [2.47, 5.72, 10.3],
    target: [0, 1.6, 0.4],
  },
  {
    name: "Damp & Mould",
    href: "/services/damp-mould",
    blurb: "Diagnosis first, then the right treatment",
    location: "Ground floor walls",
    marker: [-2.32, 0.55, -0.2],
    camera: [-10.61, 3.66, 3.4],
    target: [-1.7, 0.9, -0.2],
  },
  {
    name: "Fencing & External",
    href: "/services/fencing-external-repairs",
    blurb: "Garden fencing, gates and external repairs",
    location: "Garden & boundary",
    marker: [-1.0, 0.95, 4.1],
    camera: [2.4, 3.12, 12.43],
    target: [-0.6, 0.7, 3.2],
  },
];
