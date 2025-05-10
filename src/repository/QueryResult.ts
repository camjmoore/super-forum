export class QueryResult<T> {
  constructor(public message?: Array<string>, public entities?: Array<T>) {}
}
