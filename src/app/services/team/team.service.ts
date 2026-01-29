import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team } from '../../models/team.model';

@Injectable({
  providedIn: 'root',
})

export class TeamService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/teams';

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  createTeam(name: string): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, { name });
  }
  addMember(teamId: number, userId: number): Observable<void> {
    const url = `${this.apiUrl}/${teamId}/members`;
    return this.http.post<void>(url, { userId, role: 'member' });
  }
}
