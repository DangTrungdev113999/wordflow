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
      if ('tense' in data && 'markers' in data) {
        return <TenseTimeline {...(data as TenseTimelineProps)} />;
      }
      return null;

    case 'comparison':
      if ('left' in data && 'right' in data) {
        return <ComparisonTable {...(data as ComparisonTableProps)} />;
      }
      return null;

    case 'formula':
      if ('title' in data && 'parts' in data) {
        return <FormulaCard {...(data as FormulaCardProps)} />;
      }
      return null;

    case 'diagram':
      // Future: tree-like sentence structure diagram
      return null;

    default:
      return null;
  }
}
