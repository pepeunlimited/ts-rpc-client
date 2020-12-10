export declare class Context {
    dataLoaders: Map<string, any>;
    userId: number | null | undefined;
    isDebug: boolean;
    apolloOperationId: string | undefined;
    getDataLoader<T>(id: string, cstr: () => T): T;
}
