#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { downloadComponent } from "./download.js";
import { installComponent } from "./install.js";
import { packageJson } from "./get-package.js";
const program = new Command()
    .name(packageJson.name)
    .description("CLI to download and install components")
    .version(packageJson.version);
program
    .command("install <gitUrl> <componentPath> [targetDir]")
    .description("Download and install a component from git repository")
    .action(async (gitUrl, componentPath, targetDir = "./src/components") => {
    try {
        console.log(chalk.blue(`Downloading component from ${gitUrl}...`));
        // 下载组件文件
        const files = await downloadComponent(gitUrl, componentPath);
        // 截取组件目录最后一层目录名称
        const componentPathArr = componentPath.split("/");
        const lastComponentDirName = componentPathArr[componentPathArr.length - 1];
        // 如果组件目录最后一层目录名称和目标目录的最后一层名称不一样，则把组件目录最后一层目录名称作为目标目录最后一层目录名称
        const targetDirArr = targetDir.split("/");
        const lastTargetDirName = targetDirArr[targetDirArr.length - 1];
        if (lastComponentDirName !== lastTargetDirName) {
            targetDir = [...targetDirArr, lastComponentDirName].join("/");
        }
        // 安装组件到目标目录
        await installComponent(files, targetDir);
        console.log(chalk.green("Component installed successfully!"));
    }
    catch (error) {
        console.error(chalk.red("Error installing component:"), error);
        process.exit(1);
    }
});
program.parse();
