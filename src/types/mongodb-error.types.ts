export interface MongoDBError extends Error {
    code?: number;
}
