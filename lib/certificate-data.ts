// Define interfaces
export interface Signatory {
  name: string;
  title: string;
}

export interface AwardCertificate {
  recipient: string;
  title: string;
  description: string;
}

// Initial data
export const initialAwards: AwardCertificate[] = [
  {
    recipient: "John Doe",
    title: "Outstanding Achievement in Science",
    description: "For exceptional performance in the annual science fair"
  },
  {
    recipient: "Jane Smith",
    title: "Excellence in Leadership",
    description: "For demonstrating remarkable leadership skills in group projects"
  }
];

export const initialSignatories: Signatory[] = [
  { name: "Emma Davis", title: "Principal" },
  { name: "Robert Wilson", title: "Program Coordinator" },
  { name: "Lisa Thompson", title: "Head Teacher" }
]; 