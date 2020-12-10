export class Context {
    public dataLoaders = new Map<string, any>();

    public userId: number | null | undefined;
    public isDebug: boolean = false;
    public apolloOperationId: string|undefined

    getDataLoader<T>(id: string, cstr: () => T): T {
        if (!this.dataLoaders.has(id)) {
            this.dataLoaders.set(id, cstr());
        }
        return this.dataLoaders.get(id);
    }
}