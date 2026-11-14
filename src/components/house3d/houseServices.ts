export type StopKey =
  | "overview"
  | "plumbing"
  | "heating"
  | "bathroom"
  | "tiling"
  | "flooring"
  | "electrical"
  | "painting"
  | "carpentry"
  | "damp"
  | "leak"
  | "fencing";

export interface HouseStop {
  key: StopKey;
  name: string;
  href: string;
  /** Where in the house this stop is, in plain words */
  where: string;
  /** One line on what we do there */
  blurb: string;
  /** Camera position and look-at point for this stop */
  camera: [number, number, number];
  target: [number, number, number];
  /** true = front wall and roof on (outside view); false = cutaway */
  shell: boolean;
}

/**
 * Stops on the 3D house tour, in tour order.
 *
 * There is deliberately no "roofing" stop. Ninja Fix doesn't offer roofing as
 * a service — it appears on the site only as roof and external water ingress
 * investigations within Leak Detection. The roof stop is therefore framed as
 * leak investigation, which is what the business actually does up there.
 */
export const houseStops: HouseStop[] = [
  {
    key: "overview",
    name: "Your whole property",
    href: "/services",
    where: "Inside and out",
    blurb: "One team for every repair, from the gutters to the garden gate. Take the tour to see what we do in each part of a home.",
    camera: [9, 8.5, 14.5],
    target: [0, 3, 0.5],
    shell: true,
  },
  {
    key: "plumbing",
    name: "Plumbing & Drainage",
    href: "/services/plumbing",
    where: "Pipework, wastes and drains",
    blurb: "Leaks, blockages and emergency call-outs — from the bathroom wastes down to the drain outside.",
    camera: [6.2, 5, 13.5],
    target: [2, 2.7, -1],
    shell: false,
  },
  {
    key: "heating",
    name: "Boiler & Heating",
    href: "/services/boiler-heating-repair",
    where: "Boiler, pipework and radiators",
    blurb: "Boiler repairs and servicing, radiators, power flushing and heating controls, by Gas Safe registered engineers.",
    camera: [1.2, 3.8, 13.5],
    target: [0.6, 2.6, -0.5],
    shell: false,
  },
  {
    key: "bathroom",
    name: "Bathroom & Kitchen",
    href: "/services/bathroom-refurbishment",
    where: "First-floor bathroom, ground-floor kitchen",
    blurb: "Repairs, full refurbishment and installation of bathrooms and kitchens.",
    camera: [3, 3.6, 11.5],
    target: [2.25, 2.6, -0.5],
    shell: false,
  },
  {
    key: "tiling",
    name: "Wall & Floor Tiling",
    href: "/services/tiling",
    where: "Bathroom walls and floor",
    blurb: "Wet rooms, bathrooms and splashbacks, tiled and grouted properly.",
    camera: [3.6, 5.1, 6.6],
    target: [2.3, 3.7, -1.8],
    shell: false,
  },
  {
    key: "flooring",
    name: "Flooring & Subfloor",
    href: "/services/flooring-repairs",
    where: "Living room floor",
    blurb: "Subfloor repairs and new floor finishes, laid level and finished neatly.",
    camera: [-0.6, 2.6, 7.5],
    target: [-1.9, 0.2, -0.3],
    shell: false,
  },
  {
    key: "electrical",
    name: "Electrical Services",
    href: "/services/electrical",
    where: "Throughout the property",
    blurb: "Fault finding, rewiring and EICR certificates — every circuit from the consumer unit out.",
    camera: [0.5, 4.2, 14],
    target: [0, 2.7, 0],
    shell: false,
  },
  {
    key: "painting",
    name: "Painting & Decorating",
    href: "/services/painting-decorating",
    where: "Interior and exterior walls",
    blurb: "Interior and exterior decorating, properly prepared for a finish that lasts.",
    camera: [-3.4, 4.9, 6.2],
    target: [-1.9, 4, -2.6],
    shell: false,
  },
  {
    key: "carpentry",
    name: "Carpentry & Joinery",
    href: "/services/carpentry-joinery",
    where: "Doors, stairs and skirting",
    blurb: "Doors, staircases, skirting and fitted storage, repaired or made new.",
    camera: [-3.2, 2.3, 6.8],
    target: [0.1, 1.2, 0.2],
    shell: false,
  },
  {
    key: "damp",
    name: "Damp & Mould",
    href: "/services/damp-mould",
    where: "Ground-floor walls",
    blurb: "Diagnosis first, then the right treatment — so it doesn't just come back.",
    camera: [-0.9, 1.7, 4.9],
    target: [-3.85, 0.9, 1.1],
    shell: false,
  },
  {
    key: "leak",
    name: "Roof & Leak Investigations",
    href: "/services/leak-detection",
    where: "Roof, chimney and gutters",
    blurb: "Tracing exactly where water is getting in from above, before recommending any repair.",
    camera: [7.5, 14, 11.5],
    target: [0.4, 5.6, 0.5],
    shell: true,
  },
  {
    key: "fencing",
    name: "Fencing & External",
    href: "/services/fencing-external-repairs",
    where: "Garden and boundary",
    blurb: "Garden fencing, gates and external repairs.",
    camera: [6.5, 4.2, 17.5],
    target: [0, 1.8, 4.2],
    shell: true,
  },
];
