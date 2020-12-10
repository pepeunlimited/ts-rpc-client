export class Context {
    /**
     * REMEMBER:
     *
     * If function returns an Error instance for an individual value,
     * that Error will be CACHED to avoid frequently loading the same Error
     *
     * Avoid Error not be CACHED using dataLoaders.clear()
     */
    public dataLoaders = new Map<string, any>();

    public userId: number | null | undefined;
    public isDebug: boolean = false;
    public apolloOperationId: string|undefined

    public rpcDataLoaderOptions?: DataLoaderOptions

    public getDataLoader<T>(id: string, cstr: () => T): T {
        if (!this.dataLoaders.has(id)) {
            this.dataLoaders.set(id, cstr());
        }
        return this.dataLoaders.get(id);
    }
}

export interface DataLoaderOptions {
    cache?: boolean;
}