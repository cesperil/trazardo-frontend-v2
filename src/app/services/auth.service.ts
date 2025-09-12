import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators'; // Import the tap operator
 import { LocalStorageService } from 'src/app/services/local-storage.service';


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = environment.apiUrl;
  private apiUrlLogin = `${this.apiUrl}/auth/login`;

  constructor(private http: HttpClient, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  login(credentials: { username: string; password: string }): Observable<any> {
        return this.http.post(this.apiUrlLogin, credentials).pipe(
          tap((response: any) => {
            console.log('Login response:', response);
            const token = response.token;
            const role = response.role;
            const tecnicoId = response.tecnicoID;
            if (token) {
              this.localStorageService.setItem('authToken', token);
              this.localStorageService.setItem('authRole', role);
              this.localStorageService.setItem('tecnicoID', tecnicoId);
            }
          })
        );
  }

  getUserRole(): string | null {
    const user = JSON.parse(this.localStorageService.getItem('authRole') || '{}');
    return user?.role || null;
  }
}
