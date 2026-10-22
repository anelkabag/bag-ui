import type { CommandContext } from "./context";
import { guarded, resolveComponent } from "./shared";

/** BagUI: Search Component — live QuickPick, selecting a result opens its preview. */
export function searchCommand(ctx: CommandContext): Promise<void> {
  return guarded(async () => {
    const component = await resolveComponent(ctx, undefined, "Search BagUI components");
    if (component) {
      await ctx.preview.show(component);
    }
  }, "Unable to search BagUI components.");
}

/** bagui.preview — opens the preview panel for a given component. */
export function previewCommand(ctx: CommandContext, arg: unknown): Promise<void> {
  return guarded(async () => {
    const component = await resolveComponent(ctx, arg, "Select a BagUI component to preview");
    if (component) {
      await ctx.preview.show(component);
    }
  }, "Unable to preview this component.");
}
