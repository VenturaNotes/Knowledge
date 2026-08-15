import { Vault } from '../core/vault/vault';
import { MetadataCache } from '../core/cache/metadataCache';
import { Workspace } from '../ui/workspace/workspace';
import { EventBus } from '../core/events/eventBus';
import { CommandRegistry } from '../core/commands/commands';

export interface AppContext {
  vault: Vault;
  cache: MetadataCache;
  workspace: Workspace;
  events: EventBus;
  commands: CommandRegistry;
}