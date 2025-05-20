---
title: "Setting Up Neovim for Development"
description: "A quickstart guide to configuring Neovim as a modern code editor."
date: "2024-06-01"
tags: ["neovim", "editor", "setup"]
---

# Setting Up Neovim for Development

Neovim is a powerful, extensible text editor. Here's a basic setup:

## Installation

```sh
brew install neovim
```

## Basic Configuration

Create or edit `~/.config/nvim/init.vim`:

```vim
set number
syntax on
set tabstop=4
set shiftwidth=4
set expandtab
```

## Plugins

Use [vim-plug](https://github.com/junegunn/vim-plug):

```vim
call plug#begin('~/.vim/plugged')
Plug 'preservim/nerdtree'
Plug 'junegunn/fzf'
Plug 'neoclide/coc.nvim', {'branch': 'release'}
call plug#end()
```

## Further Reading

- [Neovim Docs](https://neovim.io/doc/)
- [Awesome Neovim](https://github.com/rockerBOO/awesome-neovim)
