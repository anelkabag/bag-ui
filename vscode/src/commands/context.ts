import type { ComponentPreviewWebview } from "../webviews/ComponentPreview";
import type { FavoritesService } from "../services/FavoritesService";
import type { InstallService } from "../services/InstallService";
import type { RegistryService } from "../services/RegistryService";

/** Everything a command needs: commands never create their own dependencies. */
export interface CommandContext {
  registry: RegistryService;
  installer: InstallService;
  favorites: FavoritesService;
  preview: ComponentPreviewWebview;
}
