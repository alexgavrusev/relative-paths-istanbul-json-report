import * as path from "path";
import type {
  Context,
  ReportNode,
  Visitor,
  FileContentWriter,
} from "istanbul-lib-report";
import { default as libReport } from "istanbul-lib-report";
import type { FileOptions, ProjectOptions } from "istanbul-reports";

export type RelativePathsJsonReportOptions = Partial<
  FileOptions & ProjectOptions
>;

export default class RelativePathsJsonReport
  extends libReport.ReportBase
  implements Partial<Visitor<ReportNode>>
{
  private file: string;
  private projectRoot: string;
  private first: boolean;
  private contentWriter!: FileContentWriter;

  constructor(opts: RelativePathsJsonReportOptions) {
    super();

    this.file = opts.file || "coverage-final.json";
    this.projectRoot = opts.projectRoot || process.cwd();
    this.first = true;
  }

  onStart(root: ReportNode, context: Context): void {
    this.contentWriter = context.writer.writeFile(
      this.file,
    ) as FileContentWriter;
    this.contentWriter.write("{");
  }

  onDetail(node: ReportNode): void {
    const fc = node.getFileCoverage();

    const key = path.relative(this.projectRoot, fc.path);
    fc.data.path = path.relative(this.projectRoot, fc.data.path);

    const cw = this.contentWriter;

    if (this.first) {
      this.first = false;
    } else {
      cw.write(",");
    }
    cw.write(JSON.stringify(key));
    cw.write(": ");
    cw.write(JSON.stringify(fc));
    cw.println("");
  }

  onEnd(): void {
    const cw = this.contentWriter;
    cw.println("}");
    cw.close();
  }
}
