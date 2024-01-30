import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DirectoryPathInfo } from "./directory.path.info.mjs";
const privateBag = new WeakMap();
const moduleDirPath = dirname(fileURLToPath(import.meta.url));
export class ApplicationModule {
    constructor() {
        privateBag.set(this, {
            directory: new DirectoryPathInfo(moduleDirPath, null)
        });
    }
    /**
     * @returns { DirectoryPathInfo }
    */
    get directory() {
        const { directory } = privateBag.get(this);
        return directory;
    }
}