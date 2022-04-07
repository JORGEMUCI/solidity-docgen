import test from './utils/test';
import path from 'path';
import { PageAssigner, Site, buildSite, pageAssigner } from './site';

interface PageSummary {
  id: string;
  items: string[];
}

/**
 * @param files The name of the Solidity file whose contents should be considered.
 */
function testPages(title: string, files: string[], assign: PageAssigner, expected: PageSummary[]) {
  test(title, t => {
    const cfg = {
      sourcesDir: 'test-contracts',
      pageExtension: '.md',
    };
    const site = buildSite(t.context.build,
      (i, f) => files.includes(path.parse(f.absolutePath).name) ? assign(i, f, cfg) : undefined
    );
    const pages = site.pages.map(p => ({
      id: p.id,
      items: p.items.map(i => i.name),
    })).sort((a, b) => a.id.localeCompare(b.id));
    t.deepEqual(pages, expected);
  });
}

testPages('assign to single page',
  ['S08_AB'],
  pageAssigner.single,
  [{ id: 'index.md', items: ['A', 'B'] }],
);

testPages('assign to item pages',
  ['S08_AB'],
  pageAssigner.items,
  [
    { id: 'A.md', items: ['A'] },
    { id: 'B.md', items: ['B'] },
  ],
);

testPages('assign to file pages',
  ['S08_AB', 'S08_C'],
  pageAssigner.files,
  [
    { id: 'S08_AB.md', items: ['A', 'B'] },
    { id: 'S08_C.md', items: ['C'] },
  ],
);
