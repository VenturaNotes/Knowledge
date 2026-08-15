import { AppContext } from '../../types';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  main?: string;
}

export abstract class Plugin {
  public app: AppContext;
  public manifest: PluginManifest;

  constructor(app: AppContext, manifest: PluginManifest) {
    this.app = app;
    this.manifest = manifest;
  }

  public onload?(): void | Promise<void>;
  public onunload?(): void | Promise<void>;
}