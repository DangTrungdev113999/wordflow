import { describe, it, expect } from 'vitest';
import { parseCSVLine, parseCSV } from '../../lib/csvParser';
import { importCustomTopicCSV, importCustomTopicJSON } from '../dataPortService';

describe('parseCSVLine', () => {
  it('parses basic comma-separated fields', () => {
    expect(parseCSVLine('hello,world,test')).toEqual(['hello', 'world', 'test']);
  });

  it('handles quoted values with commas', () => {
    expect(parseCSVLine('hello,"world, earth",test')).toEqual(['hello', 'world, earth', 'test']);
  });

  it('handles escaped quotes inside quoted values', () => {
    expect(parseCSVLine('word,"He said ""hi""",done')).toEqual(['word', 'He said "hi"', 'done']);
  });

  it('handles empty fields', () => {
    expect(parseCSVLine('word,,,')).toEqual(['word', '', '', '']);
  });

  it('trims whitespace from unquoted fields', () => {
    expect(parseCSVLine(' hello , world , test ')).toEqual(['hello', 'world', 'test']);
  });
});

describe('parseCSV', () => {
  it('throws on empty input', () => {
    expect(() => parseCSV('')).toThrow('Empty CSV');
  });

  it('parses header + rows correctly', () => {
    const csv = 'word,meaning\nbreakfast,bữa sáng\nmorning,buổi sáng';
    const result = parseCSV(csv);
    expect(result.headers).toEqual(['word', 'meaning']);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toEqual({ word: 'breakfast', meaning: 'bữa sáng' });
  });

  it('lowercases headers', () => {
    const csv = 'Word,Meaning,IPA\ntest,meaning,/test/';
    const result = parseCSV(csv);
    expect(result.headers).toEqual(['word', 'meaning', 'ipa']);
  });
});

describe('importCustomTopicCSV', () => {
  it('rejects CSV without word column', () => {
    const csv = 'meaning,ipa\nbữa sáng,/test/';
    const result = importCustomTopicCSV(csv, new Set());
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('word'))).toBe(true);
  });

  it('rejects CSV without meaning column', () => {
    const csv = 'word,ipa\nbreakfast,/test/';
    const result = importCustomTopicCSV(csv, new Set());
    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('meaning'))).toBe(true);
  });

  it('skips duplicate words (case-insensitive)', () => {
    const csv = 'word,meaning,ipa,example\nbreakfast,bữa sáng,,\nmorning,buổi sáng,,';
    const existing = new Set(['breakfast']);
    const result = importCustomTopicCSV(csv, existing);
    expect(result.success).toBe(true);
    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.words[0].word).toBe('morning');
  });

  it('skips rows with empty word field', () => {
    const csv = 'word,meaning\n,empty meaning\nvalid,ok';
    const result = importCustomTopicCSV(csv, new Set());
    expect(result.success).toBe(true);
    expect(result.imported).toBe(1);
    expect(result.words[0].word).toBe('valid');
  });
});

describe('importCustomTopicJSON', () => {
  it('rejects invalid JSON', () => {
    const result = importCustomTopicJSON('not json', new Set());
    expect(result.success).toBe(false);
    expect(result.errors).toContain('Invalid JSON');
  });

  it('rejects wrong structure', () => {
    const json = JSON.stringify({ version: 2, app: 'Other', type: 'wrong', words: [] });
    const result = importCustomTopicJSON(json, new Set());
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('validates and imports correctly', () => {
    const json = JSON.stringify({
      version: 1,
      app: 'WordFlow',
      type: 'custom_topic',
      words: [
        { word: 'breakfast', meaning: 'bữa sáng', ipa: '/ˈbrek.fəst/', example: 'I eat breakfast.', audioUrl: null },
        { word: 'morning', meaning: 'buổi sáng', ipa: '', example: '', audioUrl: null },
      ],
    });
    const result = importCustomTopicJSON(json, new Set());
    expect(result.success).toBe(true);
    expect(result.imported).toBe(2);
    expect(result.words[0].word).toBe('breakfast');
  });

  it('skips duplicates in JSON import', () => {
    const json = JSON.stringify({
      version: 1,
      app: 'WordFlow',
      type: 'custom_topic',
      words: [
        { word: 'Hello', meaning: 'xin chào' },
        { word: 'world', meaning: 'thế giới' },
      ],
    });
    const result = importCustomTopicJSON(json, new Set(['hello']));
    expect(result.success).toBe(true);
    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.words[0].word).toBe('world');
  });
});
