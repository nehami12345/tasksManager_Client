import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Team } from '../../models/team.model';
import { TeamService } from '../../services/team/team.service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../services/toast/toast';
import { DialogService } from '../../services/dialog/dialog';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  teams$ = this.teamsSubject.asObservable();

  newTeamName = '';
  isLoading = true;
  errorMsg = '';

  private teamService = inject(TeamService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading = true;

    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teamsSubject.next(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load teams.';
        this.isLoading = false;
      }
    });
  }

  createTeam() {
    if (!this.newTeamName.trim()) return;

    this.teamService.createTeam(this.newTeamName).subscribe({
      next: (teamFromServer) => {
        const newTeam: Team = {
          ...teamFromServer,
          members_count: 1
        };
        const currentTeams = this.teamsSubject.value;
        this.teamsSubject.next([...currentTeams, newTeam]);

        this.newTeamName = '';
        this.toastService.show(`Team "${newTeam.name}" created!`, 'success');
      },
      error: (err) => this.toastService.show('Failed to create team', 'error')
    });
  }

  addMember(team: Team) {
    this.dialogService.openInput(
      'Add Team Member',
      `Enter User ID to add to "${team.name}":`,
      'User ID (Number)'
    ).subscribe((result) => {

      if (!result) return;

      const userId = Number(result);

      if (isNaN(userId) || userId <= 0) {
        this.toastService.show('Invalid User ID. Please enter a positive number.', 'error');
        return;
      }

      this.teamService.addMember(team.id, userId).subscribe({
        next: () => {
          this.toastService.show('Member added successfully!', 'success');

          const currentTeams = this.teamsSubject.value;
          const updatedTeams = currentTeams.map(t => {
            if (t.id === team.id) {
              return { ...t, members_count: t.members_count + 1 };
            }
            return t;
          });
          this.teamsSubject.next(updatedTeams);
        },
        error: (err) => {
          console.error(err);
          if (err.status === 404) {
            this.toastService.show('User ID not found in the system.', 'error');
          } else if (err.status === 409) {
            this.toastService.show('User is already a member of this team.', 'info');
          } else {
            this.toastService.show('Failed to add member. Please try again.', 'error');
          }
        }
      });
    });
  }
}
