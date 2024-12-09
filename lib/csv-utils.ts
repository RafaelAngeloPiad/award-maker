import { AwardCertificate, Signatory } from './certificate-data';
import Papa from 'papaparse'; // You'll need to install this: npm install papaparse @types/papaparse

// Sample data for templates
const sampleAwards: AwardCertificate[] = [
  {
    recipient: "John Smith",
    title: "Outstanding Achievement in Mathematics",
    description: "For exceptional performance and dedication in Advanced Mathematics"
  },
  {
    recipient: "Sarah Johnson",
    title: "Excellence in Leadership",
    description: "For demonstrating outstanding leadership skills in student council"
  }
];

const sampleSignatories: Signatory[] = [
  {
    name: "Dr. James Wilson",
    title: "School Principal"
  },
  {
    name: "Prof. Mary Davis",
    title: "Department Head"
  }
];

export const parseAwardsCSV = (csvContent: string): AwardCertificate[] => {
  const { data } = Papa.parse(csvContent, { header: true });
  return data.map((row: any) => ({
    recipient: row.recipient || '',
    title: row.title || '',
    description: row.description || ''
  }));
};

export const parseSignatoriesCSV = (csvContent: string): Signatory[] => {
  const { data } = Papa.parse(csvContent, { header: true });
  return data.map((row: any) => ({
    name: row.name || '',
    title: row.title || ''
  }));
};

export const generateAwardsCSV = (awards: AwardCertificate[]): string => {
  return Papa.unparse(awards);
};

export const generateSignatoriesCSV = (signatories: Signatory[]): string => {
  return Papa.unparse(signatories);
};

// New template generation functions
export const generateAwardsTemplate = (): string => {
  return Papa.unparse(sampleAwards);
};

export const generateSignatoriesTemplate = (): string => {
  return Papa.unparse(sampleSignatories);
}; 