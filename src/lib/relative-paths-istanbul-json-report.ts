import {
  Context,
  FileContentWriter,
  ReportBase,
  ReportNode,
  Visitor,
} from 'istanbul-lib-report';
import { FileOptions, ProjectOptions } from 'istanbul-reports';
import * as path from 'path';

export type RelativePathsJsonReportOptions = Partial<
  FileOptions & ProjectOptions
>;

export default class RelativePathsJsonReport
  extends ReportBase
  implements Partial<Visitor<ReportNode>>
{
  private file: string;
  private projectRoot: string;
  private first: boolean;
  private contentWriter: FileContentWriter;

  constructor(opts: RelativePathsJsonReportOptions) {
    super();

    this.file = opts.file || 'coverage-final.json';
    this.projectRoot = opts.projectRoot || process.cwd();
    this.first = true;
  }

  onStart(root: ReportNode, context: Context) {
    this.contentWriter = context.writer.writeFile(
      this.file
    ) as FileContentWriter;
    this.contentWriter.write('{');
  }

  onDetail(node: ReportNode) {
    const fc = node.getFileCoverage();

    const key = path.relative(this.projectRoot, fc.path);
    fc.data.path = path.relative(this.projectRoot, fc.data.path);

    const cw = this.contentWriter;

    if (this.first) {
      this.first = false;
    } else {
      cw.write(',');
    }
    cw.write(JSON.stringify(key));
    cw.write(': ');
    cw.write(JSON.stringify(fc));
    cw.println('');
  }

  onEnd() {
    const cw = this.contentWriter;
    cw.println('}');
    cw.close();
  }
}
