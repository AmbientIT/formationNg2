import { Headers, Http, Request, RequestMethod, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';

export class Api<T> {
  constructor(private http: Http, private apiUrl: string) {

  }

  create(body: any): Observable<T> {
    return this.request({
      body,
      method: RequestMethod.Post,
      url: this.apiUrl.split('?')[0]
    });
  }

  destroy(id: string): Observable<T> {
    return this.request({
      method: RequestMethod.Delete,
      url: `${this.apiUrl.split('?')[0]}/${id}`
    });
  }

  findAll(): Observable<T[]> {
    return this.request({
      method: RequestMethod.Get,
      url: this.apiUrl
    });
  }

  find(id: string): Observable<T> {
    return this.request({
      method: RequestMethod.Get,
      url: `${this.apiUrl.split('?')[0]}/${id}?${this.apiUrl.split('?')[1]}`
    });
  }

  update(item: T, id: string): Observable<T> {
    return this.request({
      body: item,
      method: RequestMethod.Put,
      url: `${this.apiUrl.split('?')[0]}/${id}`
    });
  }

  request(options: any): Observable<any> {
    if (options.body) {
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }

      options.headers = new Headers({
        'Content-Type': 'application/json'
      });
    }

    return this.http.request(new Request(options))
      .map((res: Response) => res.json());
  }
}
