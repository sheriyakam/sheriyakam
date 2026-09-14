import { NextResponse } from 'next/server';

const mockVersions = [
  {
    id: 'ver-1',
    targetJobTitle: 'Director of Operations',
    company: 'Northwind Global Corp',
    initialScore: 58,
    finalScore: 96,
    createdAt: new Date().toISOString(),
    skills: ['Operations Management', 'Operational Risk Management', 'Budget Controls', 'SLA Optimization']
  },
  {
    id: 'ver-2',
    targetJobTitle: 'Senior Project Manager',
    company: 'Vanguard Systems',
    initialScore: 62,
    finalScore: 94,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    skills: ['PMP Methodologies', 'Agile Workflows', 'Cross-Functional Leadership']
  }
];

export async function GET() {
  return NextResponse.json({ success: true, versions: mockVersions });
}
