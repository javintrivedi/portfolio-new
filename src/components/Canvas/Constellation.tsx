'use client';

import { portfolioData, SectionId } from '@/data/portfolio';
import Node from './Node';

interface ConstellationProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
}

export default function Constellation({ activeSection, setActiveSection }: ConstellationProps) {
  return (
    <group>
      {Object.values(portfolioData).map((section) => (
        <Node 
          key={section.id} 
          data={section} 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      ))}
    </group>
  );
}
