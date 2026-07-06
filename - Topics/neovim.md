## Synthesis
- Great for modal editing in Normal, Insert, and Visual modes
	- #question What does visual mode look like?
### Commands
- `:set ft=python`
	- Manually tells `neovim` you're working on a python file
	- `:set filetype=python` is the non-shortcut way to do it
- Undo (backward in time)
	- `normal mode` $\to$ `u`
- Redo (forward in time)
	- `normal mode` $\to$ `Ctrl + r`
- Force Quit (Discard Changes)
	- `:q!`
- Deletes entire text within file
	- `:%d`
- Write and Quit (Save and Quit)
	- `:wq`
- Copy All in Neovim Normal mode
	- `ggVG"+y`
- Go to function definition
	- `gd`

### My Configuration
```lua
-- ==========================================================================
-- 1. CORE SETTINGS & DISABLE UNUSED PROVIDERS (Fixes health warnings)
-- ==========================================================================
vim.g.loaded_node_provider = 0
vim.g.loaded_python3_provider = 0
vim.g.loaded_perl_provider = 0
vim.g.loaded_ruby_provider = 0

vim.opt.number = true         -- Show line numbers
vim.opt.relativenumber = true -- Relative line numbers
vim.opt.tabstop = 4           -- 4 spaces for a tab
vim.opt.shiftwidth = 4        -- 4 spaces for indenting
vim.opt.expandtab = true      -- Convert tabs to spaces
vim.opt.smartindent = true    -- Smart auto-indenting
vim.opt.termguicolors = true  -- Enable 24-bit RGB colors
vim.g.mapleader = " "         -- Set leader key to Space

-- ==========================================================================
-- 2. BOOTSTRAP PLUGIN MANAGER (lazy.nvim)
-- ==========================================================================
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.uv.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git", "--branch=stable", lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- ==========================================================================
-- 3. INSTALL & CONFIGURE PLUGINS
-- ==========================================================================
require("lazy").setup({
  
  -- 🎨 Syntax Highlighting (Treesitter - Modern Main Branch)
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      -- The new plugin exports setup() from the top-level 'nvim-treesitter' module
      require("nvim-treesitter").setup()

      -- Install languages you program in (no-op if already installed)
      local ensure_installed = { "c", "lua", "vim", "vimdoc", "javascript", "typescript", "python", "html", "css" }
      require("nvim-treesitter").install(ensure_installed)

      -- Enable native Treesitter highlighting and indentation for files
      vim.api.nvim_create_autocmd("FileType", {
        callback = function()
          pcall(vim.treesitter.start)
          vim.bo.indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()"
        end,
      })
    end
  },

  -- 🧠 LSP Backend & Mason (The brains)
  {
    "neovim/nvim-lspconfig",
    dependencies = {
      "williamboman/mason.nvim",           -- Package manager for LSPs
      "williamboman/mason-lspconfig.nvim", -- Bridge between Mason and LSPConfig
      "hrsh7th/cmp-nvim-lsp",              -- Tells LSP to send data to the autocompletion engine
    },
    config = function()
      require("mason").setup()

      local lspconfig = require("lspconfig")
      local capabilities = require("cmp_nvim_lsp").default_capabilities()

      -- Configure Mason-LSPConfig (v2.0 compatible format)
      require("mason-lspconfig").setup({
        -- LSPs to install automatically
        ensure_installed = { "lua_ls", "ts_ls", "pyright" },
        -- Automatically attach capabilities to every LSP as it loads
        handlers = {
          function(server_name)
            lspconfig[server_name].setup({
              capabilities = capabilities
            })
          end,
        }
      })

      -- Create Keyboard shortcuts for when an LSP attaches to your file
      vim.api.nvim_create_autocmd("LspAttach", {
        callback = function(args)
          local opts = { buffer = args.buf }
          vim.keymap.set("n", "K", vim.lsp.buf.hover, opts)             -- Hover documentation
          vim.keymap.set("n", "gd", vim.lsp.buf.definition, opts)       -- Go to definition
          vim.keymap.set("n", "gr", vim.lsp.buf.references, opts)       -- Find references
          vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, opts)   -- Rename variable
          vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, opts) -- Code actions (fixes)
        end,
      })
    end
  },

  -- ✨ Autocompletion Engine (The UI dropdown)
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "L3MON4D3/LuaSnip",             -- Snippet engine (required by nvim-cmp)
      "saadparwaiz1/cmp_luasnip",     -- Snippet source
      "hrsh7th/cmp-buffer",           -- Suggest words from the current file
      "hrsh7th/cmp-path",             -- Suggest file paths
    },
    config = function()
      local cmp = require("cmp")
      cmp.setup({
        snippet = {
          expand = function(args)
            require("luasnip").lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<C-Space>"] = cmp.mapping.complete(),            -- Trigger completion menu
          ["<CR>"] = cmp.mapping.confirm({ select = true }), -- Press Enter to accept suggestion
          ["<Tab>"] = cmp.mapping.select_next_item(),        -- Tab down the list
          ["<S-Tab>"] = cmp.mapping.select_prev_item(),      -- Shift-Tab up the list
        }),
        sources = cmp.config.sources({
          { name = "nvim_lsp" }, -- Get suggestions from LSP
          { name = "luasnip" },  -- Get suggestions from Snippets
        }, {
          { name = "buffer" },   -- Fallback to text in the current file
          { name = "path" },
        })
      })
    end
  }
})
```
## Source [^1]
- 
## References

[^1]: 