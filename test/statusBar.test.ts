import * as assert from "node:assert";
import { STATUS_BAR_TEXT } from "../src/statusBar";

describe("Status bar item", () => {
  it("uses only the layout-panel icon", () => {
    assert.strictEqual(STATUS_BAR_TEXT, "$(layout-panel)");
  });
});
