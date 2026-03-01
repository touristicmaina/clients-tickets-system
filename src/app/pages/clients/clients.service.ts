import { Injectable } from '@angular/core';

export interface Client {
  id: number;
  name: string;
  hotel: string;
  room: string;
  phone: string;
  guideName: string;
  guidePhone: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private _clients: Client[] = [];

  get clients(): Client[] {
    return this._clients;
  }

  add(client: Client) {
    this._clients.push(client);
  }
}
