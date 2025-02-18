#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { downloadComponent } from './download.js';
import { installComponent } from './install.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const program = new Command();
program
    .name('component-cli')
    .description('CLI tool to download and install components from git repositories')
    .version('1.0.0');
program
    .command('install <gitUrl> <componentPath> [targetDir]')
    .description('Download and install a component from git repository')
    .action(async (gitUrl, componentPath, targetDir = './src/components') => {
    try {
        console.log(chalk.blue(`Downloading component from ${gitUrl}...`));
        // Download component files
        const files = await downloadComponent(gitUrl, componentPath);
        // Install component to target directory
        await installComponent(files, targetDir);
        console.log(chalk.green('Component installed successfully!'));
    }
    catch (error) {
        console.error(chalk.red('Error installing component:'), error);
        process.exit(1);
    }
});
program.parse();
