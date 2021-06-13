import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, Environment } from '../models/tokens'

export enum EndpointType {
  api = '/api/',
}

@Injectable({
  providedIn: 'root'
})
export class CoreConfigService {

  constructor(@Inject(ENVIRONMENT) private _env: Environment) { }


  getEndpoint(): string {
    return `${this._env.baseEndpoint}`;
  }

  getApiKey(): string{
    return `${this._env.apiKey}`
  }

}
