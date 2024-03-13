import { orderBy as __orderBy } from 'lodash';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { Observable, map, tap } from 'rxjs';

import { __DateFromStorage } from '@iote/time';

import { Bot } from '@app/model/convs-mgr/bots';

import { MainChannelModalComponent } from '../../../modals/main-channel-modal/main-channel-modal.component';
import { ConfirmPublishModalComponent } from '../../../modals/confirm-publish-modal/confirm-publish-modal.component';
import { ConfirmDeleteModalComponent } from '../../../modals/confirm-delete-modal/confirm-delete-modal.component';
import { ConfirmArchiveModalComponent } from '../../../modals/confirm-archive-modal/confirm-archive-modal.component';

@Component({
  selector: 'italanta-apps-bots-list-latest-courses',
  templateUrl: './bots-list-latest-courses.component.html',
  styleUrls: ['./bots-list-latest-courses.component.scss'],
})
export class BotsListLatestCoursesComponent implements OnInit, OnDestroy
{

  @Input() bots$: Observable<Bot[]>;

  private _sBs = new SubSink();

  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`;

  bots: Bot[];

  uploadMedia: boolean;

  isUploading: boolean;

  screenWidth: number;

  isPublishing: boolean;

  constructor(
    private _router$$: Router, 
    private _dialog: MatDialog
    ) { }

  ngOnInit(): void
  {

    this.screenWidth = window.innerWidth;

    if (this.bots$) {
      this._sBs.sink = this.bots$.pipe(
        map((s) => __orderBy(s, (a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
    }
  }

  connectToChannel(bot: Bot)
  {
    this._dialog.open(MainChannelModalComponent, {
      data: { bot }
    });
  }
  
  publishBot(bot:Bot){
    this.isPublishing = true;

    const dialogRef = this._dialog.open(ConfirmPublishModalComponent, {
      data: { bot }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isPublishing = false;
      }
    })
  }

  archiveBot(bot: Bot) 
  {
    this._dialog.open(ConfirmArchiveModalComponent, {
      data: { bot }
    });
  }

  openBot(id: string)
  {
    this._router$$.navigate(['bots', id]);
  }

  deleteBot(bot:Bot){
    this._dialog.open(ConfirmDeleteModalComponent, {
      data: { bot }
    });
  } 

  ngOnDestroy(): void
  {
    this._sBs.unsubscribe();
  }
}
