export class QueryResult<T> {
  constructor(public messages?: Array<string>, public entities?: Array<T>) {}
}
