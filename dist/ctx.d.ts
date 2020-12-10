export declare class Context {
    /**
     * REMEMBER:
     *
     * If function returns an Error instance for an individual value,
     * that Error will be CACHED to avoid frequently loading the same Error
     *
     * Avoid Error not be CACHED using dataLoaders.clear()
     */
    dataLoaders: Map<string, any>;
    userId: number | null | undefined;
    isDebug: boolean;
    apolloOperationId: string | undefined;
    rpcDataLoaderOptions?: DataLoaderOptions;
    getDataLoader<T>(id: string, cstr: () => T): T;
}
export interface DataLoaderOptions {
    cache?: boolean;
}
