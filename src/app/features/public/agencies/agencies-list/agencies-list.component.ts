import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface pour une agence (adapte selon ton DTO backend)
export interface Agency {
  id: number;
  name: string;
  address: string;
  phone: string;
  cityName: string; // Le backend doit renvoyer le nom de la ville, pas l'ID
  // Ajoute d'autres champs si besoin (ex: photoUrl)
}

@Injectable({ providedIn: 'root' })
export class AgenciesListComponent {
  private apiUrl = 'http://localhost:8080/api/agencies'; // adapte l'URL si besoin

  constructor(private http: HttpClient) {}

  // Récupère toutes les agences
  getAllAgencies(): Observable<Agency[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Si le backend renvoie { data: Agency[], ... }
      // adapte ce map selon ta vraie réponse
      map(response => response.data as Agency[])
    );
  }
}