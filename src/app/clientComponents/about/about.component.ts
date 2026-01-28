import { AboutteamService } from './../../core/services/aboutteam.service';
import { AboutService } from './../../core/services/about.service';
import { Meta, Title } from '@angular/platform-browser';
import { TranslatedPipe } from './../../core/pipes/translate.pipe';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { IAbout } from '../../core/interfaces/iabout';
import { Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IAboutTeam } from '../../core/interfaces/aboutteam';
import { ReloadableComponent } from '../reloadable/reloadable.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslatedPipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent extends ReloadableComponent {

    private readonly AboutService = inject(AboutService);
    private readonly AboutteamService = inject(AboutteamService);

    aboutdataData: WritableSignal<IAbout | null> = signal(null);

    aboutteamData: WritableSignal<IAboutTeam[] | null> = signal([]);


      ngOnInit(): void {
      this.loadData();
      this.onReload(() => this.loadData())
      this.loadTeamData();
      this.onReload(() => this.loadTeamData())
      }

    // ========================
    // Load About Data
    // ========================
    loadData() {
      this.AboutService.getAboutData()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.aboutdataData.set(res);
           
            },
            error: (err: HttpErrorResponse) => {
              console.log(err.message);
            }
          });
    }

    // ========================
    // Load About Team Data
    // ========================
    loadTeamData() {
      this.AboutteamService.getaboutteamData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.aboutteamData.set(res);
        },
        error: (err: HttpErrorResponse) => {
          console.log("error is ",err.message);
        }
      });
    }



}
