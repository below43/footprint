import * as assert from "node:assert";
import { generateCandidates } from "../src/color/generator";
import { WorkspaceColorRegistry } from "../src/color/registry";
import { normalize } from "../src/workspaceIdentity";

describe("Footprint", () => {
  it("generates deterministic colors", () => {
    assert.deepStrictEqual(
      generateCandidates("workspace-a"),
      generateCandidates("workspace-a")
    );
  });

  it("generates different colors for different identities", () => {
    assert.notStrictEqual(
      generateCandidates("workspace-a")[0].hex,
      generateCandidates("workspace-b")[0].hex
    );
  });

  it("does not change a workspace color when another workspace is opened", () => {
    const registry = new WorkspaceColorRegistry();
    const before = registry.assign("workspace-a").hex;

    registry.assign("workspace-b");
    registry.assign("workspace-c");

    assert.strictEqual(registry.assign("workspace-a").hex, before);
  });

  it("does not change a workspace color after another workspace is released", () => {
    const registry = new WorkspaceColorRegistry();
    const before = registry.assign("workspace-a").hex;

    registry.assign("workspace-b");
    registry.release("workspace-b");

    assert.strictEqual(registry.assign("workspace-a").hex, before);
  });

  it("normalizes paths", () => {
    assert.strictEqual(
      normalize("C:\\Projects\\Footprint\\"),
      "c:/projects/footprint/"
    );
  });
});
