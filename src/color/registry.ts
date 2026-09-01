import { ColorCandidate, generateCandidates } from "./generator";

/**
 * Keeps the automatic workspace colour stable for the lifetime of the extension.
 *
 * Important: colour selection must NOT depend on which other workspaces happen to
 * be open. Otherwise opening another workspace can cause an existing workspace
 * to change colour, which breaks the user's visual association with that workspace.
 *
 * Candidate generation is deterministic, so the first candidate is the stable
 * "footprint" for a workspace. The registry is deliberately kept simple and does
 * not perform active-workspace collision resolution.
 */
export class WorkspaceColorRegistry {
  private assignments = new Map<string, ColorCandidate>();

  assign(identity: string): ColorCandidate {
    const existing = this.assignments.get(identity);
    if (existing) return existing;

    const color = generateCandidates(identity, 1)[0];
    this.assignments.set(identity, color);
    return color;
  }

  release(identity: string): void {
    this.assignments.delete(identity);
  }

  values(): ColorCandidate[] {
    return [...this.assignments.values()];
  }
}
