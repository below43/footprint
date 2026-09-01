import * as vscode from "vscode";
const KEY="workspaceColorOverrides";
export function getOverride(c:vscode.ExtensionContext,id:string):string|undefined {
  return c.globalState.get<Record<string,string>>(KEY,{})[id];
}
export async function setOverride(c:vscode.ExtensionContext,id:string,color:string):Promise<void> {
  const v=c.globalState.get<Record<string,string>>(KEY,{});
  v[id]=color;
  await c.globalState.update(KEY,v);
}
export async function removeOverride(c:vscode.ExtensionContext,id:string):Promise<void> {
  const v=c.globalState.get<Record<string,string>>(KEY,{});
  delete v[id];
  await c.globalState.update(KEY,v);
}