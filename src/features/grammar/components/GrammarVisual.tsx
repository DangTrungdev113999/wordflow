import { TenseTimeline, type TenseTimelineProps } from './TenseTimeline';
import { ComparisonTable, type ComparisonTableProps } from './ComparisonTable';
import { FormulaCard, type FormulaCardProps } from './FormulaCard';

interface GrammarVisualProps {
  type: 'timeline' | 'diagram' | 'comparison' | 'formula';
  data: Record<string, unknown>;
}

export function GrammarVisual({ type, data }: GrammarVisualProps) {
  switch (type) {
    case 'timeline':
      return <TenseTimeline {...(data as unknown as TenseTimelineProps)} />;

    case 'comparison':
      return <ComparisonTable {...(data as unknown as ComparisonTableProps)} />;

    case 'formula':
      return <FormulaCard {...(data as unknown as FormulaCardProps)} />;

    case 'diagram':
      // Future: tree-like sentence structure diagram
      return null;

    default:
      return null;
  }
}
