import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LogResponse} from "../entity/model";

@Injectable({
  providedIn: 'root'
})
export class LogServiceService {

  private apiUrl='http://localhost:9595/getLogs';
  constructor(private http:HttpClient) { }

  getLogs(){

    return this.http.get<LogResponse>(this.apiUrl)
  }
}
