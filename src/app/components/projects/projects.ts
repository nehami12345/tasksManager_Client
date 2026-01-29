import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Project } from '../../models/project.model';
import { Team } from '../../models/team.model';
import { TeamService } from '../../services/team/team.service';
import { ProjectService } from '../../services/project/project';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { ToastService } from '../../services/toast/toast';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$ = this.projectsSubject.asObservable();

  teams$!: Observable<Team[]>;
  teamsList: Team[] = [];

  newProjectName = '';
  newProjectDesc = '';
  selectedTeamId: number | null = null;

  isLoading = false;
  errorMsg = '';

  private projectService = inject(ProjectService);
  private teamService = inject(TeamService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.isLoading = true;
    this.teamService.getTeams().subscribe({
      next: (teamsData) => {
        this.teamsList = teamsData;
        if (teamsData.length > 0 && !this.selectedTeamId) {
          this.selectedTeamId = teamsData[0].id;
        }
        this.loadProjects();
      },
      error: (err) => {
        this.toastService.show('Failed to load teams', 'error');
        this.isLoading = false;
      }
    });
    const filterTeamId = this.route.snapshot.queryParamMap.get('teamId');

    this.projectService.getProjects().subscribe({
      next: (data) => {
        let projectsToShow = data;
        if (filterTeamId) {
          const id = Number(filterTeamId);
          projectsToShow = data.filter(p => p.team_id === id);
          this.selectedTeamId = id;
        }

        this.projectsSubject.next(projectsToShow);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load projects';
        this.isLoading = false;
      }
    });
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (projectsData) => {
        const filterTeamId = this.route.snapshot.queryParamMap.get('teamId');
        let projectsToShow = projectsData;

        if (filterTeamId) {
          const id = Number(filterTeamId);
          projectsToShow = projectsData.filter(p => p.team_id === id);
          this.selectedTeamId = id;
        }

        this.projectsSubject.next(projectsToShow);

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load projects';
        this.isLoading = false;
      }
    });
  }

  createProject() {
    if (!this.selectedTeamId) return;

    if (!this.newProjectName.trim()) {
      this.toastService.show('Project name is required', 'error');
      return;
    }

    this.projectService.createProject(this.selectedTeamId, this.newProjectName, this.newProjectDesc).subscribe({
      next: (project) => {
        const currentProjects = this.projectsSubject.value;
        this.projectsSubject.next([...currentProjects, project]);

        this.newProjectName = '';
        this.newProjectDesc = '';
        this.toastService.show(`Project "${project.name}" created`, 'success');
      },
      error: () => this.toastService.show('Failed to create project', 'error')
    });
  }

}