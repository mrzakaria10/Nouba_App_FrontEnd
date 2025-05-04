import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agency-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Espace Agence</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Statistiques -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Clients en attente</h3>
          <p class="text-3xl font-bold text-blue-600">12</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Clients servis aujourd'hui</h3>
          <p class="text-3xl font-bold text-green-600">45</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Temps d'attente moyen</h3>
          <p class="text-3xl font-bold text-orange-600">15 min</p>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Actions rapides</h3>
          <div class="space-y-4">
            <button class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Appeler le prochain client
            </button>
            <button class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Gérer les files d'attente
            </button>
            <button class="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">
              Voir les statistiques
            </button>
          </div>
        </div>

        <!-- Historique récent -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-4">Historique récent</h3>
          <div class="space-y-4">
            <div class="border-b pb-2">
              <p class="font-medium">Client #1234</p>
              <p class="text-sm text-gray-600">Servi il y a 5 minutes</p>
            </div>
            <div class="border-b pb-2">
              <p class="font-medium">Client #1235</p>
              <p class="text-sm text-gray-600">Servi il y a 10 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {} 