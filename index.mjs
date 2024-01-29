import { existsSync, walkDir } from "utils";
import { ClassFile } from "./lib/class.file.mjs";
const directoryPath = process.argv[2];
if (!existsSync(directoryPath)) {
    throw new Error(`${directoryPath} directory does not exist`);
}
(async () => {
    const moduleScriptFilePaths = [];
    await walkDir(directoryPath, (filePath) => {
        if (filePath.endsWith('.mjs')) {
            moduleScriptFilePaths.push(filePath);
        }
    });
    for (const moduleScriptFilePath of moduleScriptFilePaths) {
        const classFiles = new ClassFile(moduleScriptFilePath);
        await classFiles.load();
    }
})().catch(err => console.log(err));

