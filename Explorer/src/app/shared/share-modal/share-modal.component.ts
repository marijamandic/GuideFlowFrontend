import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css']
})
export class ShareModalComponent implements OnInit {
  modalForm: FormGroup;
  user: User | undefined;
  followersMap: Map<number, string> = new Map(); // Mapa za praćenje followerId i followerUsername
  selectedFollowerId: number | undefined = undefined; // Selektovani followerId
  @Input() postId!: number; // Prosleđeni ID posta
  @Input() isTour : boolean;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private service: AdministrationService, private authService: AuthService) {
    this.modalForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      selectedFollower: ['', Validators.required] // FormControl za selektovanje followera
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitDescription() {
    if (this.modalForm.valid) {
      // Prosledjivanje selektovanog followera zajedno sa opisom
      this.submit.emit(`Description: ${this.modalForm.value.description}, FollowerId: ${this.selectedFollowerId}`);
    }
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    if (this.postId) {
      this.loadPostDetails(this.postId);
    }
  }

  loadPostDetails(postId: number): void {
    console.log(postId);
    let IdOfUser = 0;
    if (this.user !== undefined) {
      IdOfUser = this.user.id;
    }
    this.service.getProfileInfoByUserId(IdOfUser).subscribe({
      next: (result: any) => {
        console.log(result);
        this.populateFollowersMap(result.followers); // Popunjavanje mape sa follower-ima
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  populateFollowersMap(followers: any[]): void {
    this.followersMap.clear(); // Cistimo staru mapu pre nego sto popunimo novu
    followers.forEach(follower => {
      this.followersMap.set(follower.followerId, follower.followerUsername);
    });
  }
}

