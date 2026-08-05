## Synthesis
- Great for modal editing in Normal, Insert, and Visual modes
	- #question What does visual mode look like?
### Commands
- Deletes everything from the cursor to the end of the line (remains in Normal mode).
	- `D`
- Deletes from the cursor to the end of the line and immediately switches to **Insert mode** so you can start typing new text.
	- `C`
- `:set ft=python`
	- Manually tells `neovim` you're working on a python file
	- `:set filetype=python` is the non-shortcut way to do it
- Undo (backward in time)
	- `normal mode` $\to$ `u`
- Redo (forward in time)
	- `normal mode` $\to$ `Ctrl + r`
- Force Quit (Discard Changes)
	- `:q!`
- Jumping to a specific line
	- 14k: Jump up 14 lines.
	- 14j: Jump down 14 lines.
- Deletes entire text within file
	- `:%d`
- Write and Quit (Save and Quit)
	- `:wq`
- Copy All in Neovim Normal mode
	- `ggVG"+y`
	- `:%y+`
- Just copy selection
	- Original: `"+y`
	- Custom: `Space + y` in normal mode
- Paste selection (custom)
	- `Space + p` in normal mode
- Go to function definition
	- `gd` and `control + t` returns back
- Indent + Un-indent (tab replacement)
	- `Control + t`
	- `Control + d` or `control + h` or backspace?
- Switching between windows
	- `ctrl + w`
		- Then do `j` or `k` (to go down or up)
- Renaming a file in neo-tree
	- After `Command + e`, just need to press `r` to rename a specific file with proper extension
- Add a file in neo-tree
	- `command + e` $\to$ `a`
- Delete a word that the cursor is on
	- `ciw`
		- `c` = change
		- `i` = inner (word itself, excluding surrounding whitespace)
		- `w` = word
- Delete the current line and enter insert mode
	- `cc`
		- `S` used to do this but this was replaced for the `flash.nvim` plugin
- Delete character under cursor and enter insert mode
	- `cl`
		- `s` used to do this but this was replaced for the `flash.nvim` plugin
- Change a word within a specific block
	1. Visually select the block of lines (press `V` and use arrow keys or `j/k` to select the lines).
		- You can also highlight with `S` and then choose the range because you have `flash.nvim` plugin installed. 
	2. Type `:s/car/model/g`
		- `g` stands for global. Otherwise it would just replace the first match it finds on each line. 
	3. Press `Enter`
This
```python
def __init__(self, color, car):
	self.color = color
	self.car = car
```
Turns into this
```python
    def __init__(self, color, model):
        self.color = color
        self.model = model
```
- Save all modified background files at once
	- `:q`
- Fast Copy and Fast Delete
	- `dS` and then choose what you want deleted
	- `yS` choose the section you want copied
- Repeat last action
	- `.`
		- Great for if you want to indent or dedent text more than once.
- Indent and dedent text in normal mode
	- `>>` indent
	- `<<` dedent
- Renaming words (will replace it with every instance across file and projects. Do `:wa` to write all)
	- `space + c + r` Think of `Code Rename`. Lazy Vim uses this configuration
	- `:wa`
- Hide the current search highlighting
	- `:noh`
	- Could implement the below within nvim so that when you press enter as well, it will hide the search
```lua
-- Clear search highlight on pressing <Esc> in normal mode
vim.keymap.set("n", "<Esc>", "<cmd>nohlsearch<CR>", { desc = "Clear search highlight" })
```
- View suggested commands
	- Press `ctrl + n`
		- Then can navigate down with `ctrl + n` or up with `ctrl + p`
			- `Tab` works as well for going down and `Shift + Tab` for 
- Enter Insert mode and start typing on new line below
	- `o`
### fzf + neo-tree
- Space + e : Toggles the Neo-tree sidebar.
- Space + f + f : Triggers fzf-lua to find files by typing their names.
- Space + f + g : Triggers fzf-lua to do a live text search (live_grep) across your files.
- Space + f + b : Triggers fzf-lua to list and switch between your currently open files/buffers.
### My Configuration
- Indent guides included
- Swapped files saved here
	- `/Users/<your-username>/.local/state/nvim/swap/`
```lua
-- ==========================================================================
-- 1. CORE SETTINGS & DISABLE UNUSED PROVIDERS (Fixes health warnings)
-- ==========================================================================
vim.g.loaded_node_provider = 0
vim.g.loaded_python3_provider = 0
vim.g.loaded_perl_provider = 0
vim.g.loaded_ruby_provider = 0

vim.opt.number = true             -- Show line numbers
vim.opt.relativenumber = true     -- Relative line numbers
vim.opt.tabstop = 4               -- 4 spaces for a tab
vim.opt.shiftwidth = 4            -- 4 spaces for indenting
vim.opt.expandtab = true          -- Convert tabs to spaces
vim.opt.smartindent = true        -- Smart auto-indenting
vim.opt.termguicolors = true      -- Enable 24-bit RGB colors
vim.opt.clipboard = "unnamedplus" -- Sync Neovim clipboard with system clipboard
vim.opt.swapfile = true           -- Enable swap files in isolated state directory
vim.opt.directory = vim.fn.stdpath("state") .. "/swap//"
vim.g.mapleader = " "             -- Set leader key to Space

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

  -- 📏 Indent guides (VS Code Style)
  {
    "lukas-reineke/indent-blankline.nvim",
    main = "ibl",
    opts = {
      indent = {
        char = "│", -- Thin, clean vertical line
      },
      scope = {
        enabled = false, -- Turn off active block highlighting to keep it minimal
      },
    },
    config = function(_, opts)
      -- Create a custom highlight group linked to your line numbers
      -- This ensures the indent guides automatically match your theme's muted color
      vim.api.nvim_create_autocmd("ColorScheme", {
        callback = function()
          vim.api.nvim_set_hl(0, "IblIndentCustom", { link = "LineNr" })
        end,
      })
      vim.api.nvim_set_hl(0, "IblIndentCustom", { link = "LineNr" })

      opts.indent.highlight = { "IblIndentCustom" }
      require("ibl").setup(opts)
    end,
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
          vim.keymap.set("n", "<leader>cr", vim.lsp.buf.rename, opts)   -- Rename variable (Changed from <leader>rn)
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
      local has_words_before = function()
        unpack = unpack or table.unpack
        local line, col = unpack(vim.api.nvim_win_get_cursor(0))
        return col ~= 0 and vim.api.nvim_buf_get_lines(0, line - 1, line, true)[1]:sub(col, col):match("%s") == nil
      end

      local cmp = require("cmp")
      cmp.setup({
        -- Disable auto-popup so suggestions only appear on demand
        completion = {
          autocomplete = false,
          completeopt = "menu,menuone,noselect", -- Disable native autoselect so mappings have absolute control
        },
        preselect = cmp.PreselectMode.None,     -- Do not preselect visually, allowing mappings to handle insertion

        snippet = {
          expand = function(args)
            require("luasnip").lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<C-n>"] = cmp.mapping(function(fallback)         -- Keep C-n as standard manual trigger fallback
            if cmp.visible() then
              cmp.select_next_item({ behavior = cmp.SelectBehavior.Insert })
            else
              cmp.complete()
              cmp.select_next_item({ behavior = cmp.SelectBehavior.Insert })
            end
          end, { "i", "s" }),
          ["<CR>"] = cmp.mapping(function(fallback)          -- Press Enter to accept suggestion
            if cmp.visible() then
              cmp.confirm({ select = true })
            else
              fallback()
            end
          end, { "i", "s" }),
          ["<Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_next_item({ behavior = cmp.SelectBehavior.Insert })
            elseif has_words_before() then
              cmp.complete()
              cmp.select_next_item({ behavior = cmp.SelectBehavior.Insert })
            else
              fallback() -- Act like a normal indentation tab on whitespace/empty lines
            end
          end, { "i", "s" }),
          ["<S-Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_prev_item({ behavior = cmp.SelectBehavior.Insert })
            else
              fallback()
            end
          end, { "i", "s" }),
          ["<BS>"] = cmp.mapping(function(fallback)          -- Exit active completion session on Backspace
            cmp.abort()
            fallback()
          end, { "i", "s" }),
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
  },

  -- ⚡ fzf-lua (Lightning fast fuzzy finder)
  {
    "ibhagwan/fzf-lua",
    dependencies = { "nvim-tree/nvim-web-devicons" }, -- Adds icons to files in search results
    config = function()
      local fzf = require("fzf-lua")
      fzf.setup({
        winopts = {
          height = 0.85,
          width = 0.80,
          preview = {
            layout = "vertical", -- Places preview windows at the bottom/top of floating container
          },
        },
      })

      -- Keymaps for quick searching
      vim.keymap.set("n", "<leader>ff", fzf.files, { desc = "Find Files (fzf)" })
      vim.keymap.set("n", "<leader>fg", fzf.live_grep, { desc = "Live Grep (fzf)" })
      vim.keymap.set("n", "<leader>fb", fzf.buffers, { desc = "Find Open Buffers (fzf)" })
    end
  },

  -- 🌌 flash.nvim (Instant visual jumping within your viewport)
  {
    "folke/flash.nvim",
    event = "VeryLazy",
    opts = {}, -- Employs default styling and behavior
    keys = {
      {
        "s",
        mode = { "n", "x", "o" },
        function() require("flash").jump() end,
        desc = "Flash Jump",
      },
      {
        "S",
        mode = { "n", "x", "o" },
        function() require("flash").treesitter() end,
        desc = "Flash Treesitter",
      },
    },
  },

  -- 🌲 Neo-tree (Classic file tree sidebar, toggleable)
  {
    "nvim-neo-tree/neo-tree.nvim",
    branch = "v3.x",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "nvim-tree/nvim-web-devicons",
      "MunifTanjim/nui.nvim",
    },
    config = function()
      -- Press Space + e to toggle the tree sidebar
      vim.keymap.set("n", "<leader>e", "<CMD>Neotree toggle left<CR>", { desc = "Toggle File Tree" })

      require("neo-tree").setup({
        filesystem = {
          follow_current_file = {
            enabled = true,         -- Auto-expand directory tree to match the active file
            leave_dirs_open = false, -- Close other folders when focusing on a new one
          },
        },
        event_handlers = {
          {
            event = "file_opened",
            handler = function(file_path)
              -- Automatically close Neo-tree when a file is opened
              require("neo-tree.command").execute({ action = "close" })
            end
          },
        }
      })
    end
  }
})

-- ==========================================================================
-- 4. CUSTOM KEYMAPS & BACKGROUND SCRIPT RUNNER
-- ==========================================================================

-- Copy to system clipboard in Normal and Visual modes
vim.keymap.set({"n", "v"}, "<leader>y", '"+y', { desc = "Yank to system clipboard" })

-- Paste from system clipboard in Normal and Visual modes
vim.keymap.set({"n", "v"}, "<leader>p", '"+p', { desc = "Paste from system clipboard" })

local run_job_id = nil -- Keeps track of the active background run process

local function save_and_run()
  vim.cmd("write") -- Save the file automatically
  local filetype = vim.bo.filetype
  local filename = vim.fn.expand("%") -- Full path to current file

  -- Determine background execution interpreter
  local interpreter
  if filetype == "python" then
    interpreter = "python3"
  elseif filetype == "javascript" or filetype == "typescript" then
    interpreter = "node"
  elseif filetype == "sh" then
    interpreter = "bash"
  else
    print("No run command configured for filetype: " .. filetype)
    return
  end

  -- If there is a job already running, terminate it cleanly first
  if run_job_id then
    pcall(vim.fn.jobstop, run_job_id)
    run_job_id = nil
  end

  -- Find or create a dedicated scratch buffer for execution outputs
  local out_buf = nil
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_get_name(buf):match("%*Run Output%*$") then
      out_buf = buf
      break
    end
  end

  if not out_buf then
    out_buf = vim.api.nvim_create_buf(false, true) -- listed = false, scratch = true
    vim.api.nvim_buf_set_name(out_buf, "*Run Output*")
    vim.bo[out_buf].buftype = "nofile"
    vim.bo[out_buf].bufhidden = "hide"
    vim.bo[out_buf].swapfile = false
    
    -- Press Escape inside the output buffer window to close it instantly
    vim.keymap.set("n", "<Esc>", ":q<CR>", { buffer = out_buf, silent = true, desc = "Close output window" })
  end

  -- Find if there is an active window displaying this buffer
  local out_win = nil
  for _, win in ipairs(vim.api.nvim_tabpage_list_wins(0)) do
    if vim.api.nvim_win_get_buf(win) == out_buf then
      out_win = win
      break
    end
  end

  -- Record the original coding window so we can return focus to it
  local original_win = vim.api.nvim_get_current_win()

  if not out_win then
    -- Open a horizontal split at the bottom of the screen
    vim.cmd("botright split")
    out_win = vim.api.nvim_get_current_win()
    vim.api.nvim_win_set_buf(out_win, out_buf)
    vim.api.nvim_win_set_height(out_win, 10) -- Compact split window height
  end

  -- Clear previous text and show execution start message
  vim.api.nvim_buf_set_lines(out_buf, 0, -1, false, { "Running: " .. interpreter .. " " .. filename, "" })

  -- Appends script stdout/stderr output to our buffer in real-time
  local function append_output(_, data)
    if data then
      -- Filter out empty flush signals sent by the job
      if #data == 1 and data[1] == "" then
        return
      end
      vim.api.nvim_buf_set_lines(out_buf, -1, -1, false, data)
      
      -- Auto-scroll to the bottom of the output window
      if vim.api.nvim_win_is_valid(out_win) then
        local line_count = vim.api.nvim_buf_line_count(out_buf)
        pcall(vim.api.nvim_win_set_cursor, out_win, { line_count, 0 })
      end
    end
  end

  -- Run the process asynchronously
  run_job_id = vim.fn.jobstart({ interpreter, filename }, {
    stdout_buffered = false, -- stream stdout output in real-time
    stderr_buffered = false, -- stream stderr output in real-time
    on_stdout = append_output,
    on_stderr = append_output,
    on_exit = function(_, exit_code)
      vim.api.nvim_buf_set_lines(out_buf, -1, -1, false, { "", "[Process exited with code " .. exit_code .. "]" })
      run_job_id = nil
    end
  })

  -- Return focus to your code editor window immediately
  vim.api.nvim_set_current_win(original_win)
end

-- Run script with Space + r (Executes instantly now)
vim.keymap.set("n", "<leader>r", save_and_run, { desc = "Save and run current script in background" })

-- ==========================================================================
-- 5. AUTOMATIC CLEANUP AUTOCOMMANDS
-- ==========================================================================

local autoclose_group = vim.api.nvim_create_augroup("AutoCloseRunOutput", { clear = true })

-- (1) Close the output split automatically if it is the last remaining window (e.g. after :q on code)
vim.api.nvim_create_autocmd("BufEnter", {
  group = autoclose_group,
  callback = function()
    local wins = vim.api.nvim_tabpage_list_wins(0)
    if #wins == 1 then
      local buf = vim.api.nvim_win_get_buf(wins[1])
      local name = vim.api.nvim_buf_get_name(buf)
      if name:match("%*Run Output%*$") then
        vim.cmd("quit")
      end
    end
  end
})

-- (2) Close the output split automatically if you delete the script buffer (e.g. :bd on code)
vim.api.nvim_create_autocmd("BufDelete", {
  group = autoclose_group,
  pattern = { "*.py", "*.js", "*.ts", "*.sh" },
  callback = function(ev)
    local deleted_buf = ev.buf
    local script_buf_found = false

    -- Check if there are any other active code buffers still loaded
    for _, buf in ipairs(vim.api.nvim_list_bufs()) do
      if vim.api.nvim_buf_is_loaded(buf) and buf ~= deleted_buf then
        local ft = vim.bo[buf].filetype
        if ft == "python" or ft == "javascript" or ft == "typescript" or ft == "sh" then
          script_buf_found = true
          break
        end
      end
    end

    -- If no other scripts are loaded, safely close the output window
    if not script_buf_found then
      for _, win in ipairs(vim.api.nvim_tabpage_list_wins(0)) do
        local buf = vim.api.nvim_win_get_buf(win)
        local name = vim.api.nvim_buf_get_name(buf)
        if name:match("%*Run Output%*$") then
          pcall(vim.api.nvim_win_close, win, true)
        end
      end
    end
  end
})
```
## Source [^1]
- 
## References

[^1]: 