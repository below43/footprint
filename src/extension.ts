import * as vscode from "vscode";
import { getWorkspaceIdentity } from "./workspaceIdentity";
import { WorkspaceColorRegistry } from "./color/registry";
import { getOverride, removeOverride, setOverride } from "./overrides";
import { applyStatusBarTheme } from "./themeManager";
import { foregroundFor, hexToRgb } from "./color/oklch";

let status:vscode.StatusBarItem;
let registry:WorkspaceColorRegistry;

export async function activate(context:vscode.ExtensionContext):Promise<void>{
  registry=new WorkspaceColorRegistry();
  status=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,10);
  status.command="footprint.workspaceColor";
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "footprint.workspaceColor",
      () => workspaceMenu(context)
    ),
    vscode.workspace.onDidChangeWorkspaceFolders(
      () => void refresh(context)
    ),
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration("footprint")) {
        void refresh(context);
      }
    })
  );
  await refresh(context);
}

async function refresh(context:vscode.ExtensionContext):Promise<void>{
  const identity=getWorkspaceIdentity();
  if(!identity){status.hide();return;}

  const automatic=registry.assign(identity);
  const override=getOverride(context,identity);
  const color=override??automatic.hex;
  const foreground=override?foregroundFor(hexToRgb(override)):automatic.foreground;

  status.text="$(layout-panel)";
  status.tooltip=`${vscode.workspace.name??"Workspace"}\nWorkspace color: ${color}\nClick to change`;
  status.show();

  if(vscode.workspace.getConfiguration("footprint").get<boolean>("enableStatusBarColor",true)){
    await applyStatusBarTheme(context,color,foreground);
  }
}

async function workspaceMenu(
  context: vscode.ExtensionContext
): Promise<void> {
  const identity = getWorkspaceIdentity();
  if (!identity) return;

  const automatic = registry.assign(identity);
  const override = getOverride(context, identity);

  const items: vscode.QuickPickItem[] = [
    {
      label: `${override ? "" : "✓ "}Automatic`,
      description: automatic.hex,
      detail: "Use the deterministic Footprint color"
    },
    {
      label: `${override ? "✓ " : ""}Custom…`,
      description: override ?? "Choose a custom color",
      detail: override
        ? "Edit your current custom color"
        : "Set a custom workspace color"
    }
  ];

  const pick = await vscode.window.showQuickPick(items, {
    placeHolder: `Footprint · ${vscode.workspace.name ?? "Workspace"}`
  });

  if (!pick) return;

  if (pick.label.includes("Automatic")) {
    await useAutomatic(context);
  } else if (pick.label.includes("Custom")) {
    await setCustomColor(context);
  }
}

async function setCustomColor(context:vscode.ExtensionContext):Promise<void>{
  const identity=getWorkspaceIdentity();
  if(!identity)return;
  const automatic=registry.assign(identity);
  const current=getOverride(context,identity)??automatic.hex;

  const value=await vscode.window.showInputBox({
    prompt:"Workspace color",
    value:current,
    placeHolder:"#3B82F6",
    validateInput:(input:string)=>/^#[0-9a-fA-F]{6}$/.test(input)?undefined:"Use #RRGGBB."
  });
  if(!value)return;
  await setOverride(context,identity,value);
  await refresh(context);
}

async function useAutomatic(context:vscode.ExtensionContext):Promise<void>{
  const identity=getWorkspaceIdentity();
  if(!identity)return;
  await removeOverride(context,identity);
  await refresh(context);
}


export function deactivate():void{}