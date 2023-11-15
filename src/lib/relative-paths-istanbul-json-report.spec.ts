import { createContext } from 'istanbul-lib-report';
import { createCoverageMap } from 'istanbul-lib-coverage';
import { dirSync } from 'tmp';
import { readJSON } from 'fs-extra';
import { resolve } from 'path';

import RelativePathsJsonReport from './relative-paths-istanbul-json-report';

describe('RelativePathsJsonReport', () => {
  it('should output correct json', async () => {
    const fixtureMap = await readJSON(
      resolve(__dirname, '__fixtures__', 'github-649.json')
    );

    const dir = dirSync().name;
    const file = 'coverage.json';

    const context = createContext({
      dir,
      coverageMap: createCoverageMap(fixtureMap),
    });
    const tree = context.getTree();

    const report = new RelativePathsJsonReport({
      projectRoot: '/Users/benjamincoe',
      file,
    });

    tree.visit(report, context);

    const coverageJson = await readJSON(resolve(dir, file));

    expect(coverageJson).toMatchSnapshot();
  });
});
