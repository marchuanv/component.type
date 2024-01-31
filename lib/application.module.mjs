import { DirectoryPathInfo } from "./directory.path.info.mjs";
const privateBag = new WeakMap();
export class ApplicationModule {
    constructor() {
        const moduleDirPath = process.cwd();
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