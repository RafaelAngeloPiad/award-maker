import { AwardCertificate, Signatory } from './certificate-data';
import Papa from 'papaparse';

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

interface CSVAwardRow {
  recipient: string;
  title: string;
  description: string;
}

interface CSVSignatoryRow {
  name: string;
  title: string;
}

interface ParseResult<T> {
  data: T[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

export const parseAwardsCSV = (csvContent: string): AwardCertificate[] => {
  const { data } = Papa.parse<CSVAwardRow>(csvContent, {
    header: true,
    transform: (value) => value.trim()
  }) as ParseResult<CSVAwardRow>;

  return data.map((row) => ({
    recipient: row.recipient || '',
    title: row.title || '',
    description: row.description || ''
  }));
};

export const parseSignatoriesCSV = (csvContent: string): Signatory[] => {
  const { data } = Papa.parse<CSVSignatoryRow>(csvContent, {
    header: true,
    transform: (value) => value.trim()
  }) as ParseResult<CSVSignatoryRow>;

  return data.map((row) => ({
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

export const generateAwardsTemplate = (): string => {
  return Papa.unparse(sampleAwards);
};

export const generateSignatoriesTemplate = (): string => {
  return Papa.unparse(sampleSignatories);
}; 