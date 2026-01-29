import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Project } from '../../models/project.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/projects';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }
  createProject(teamId: number, name: string, description: string): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, { teamId, name, description });
  }
}
