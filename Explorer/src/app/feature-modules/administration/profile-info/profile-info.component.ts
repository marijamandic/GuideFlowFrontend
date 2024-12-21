import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProfileInfo } from '../model/profile-info.model';
import { AdministrationService } from '../administration.service';
import { environment } from 'src/env/environment';
import { Follower } from '../model/follower.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Subscription } from 'rxjs';
import { Problem } from 'src/app/shared/model/problem.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Category } from 'src/app/shared/model/details.model';
import { Message } from 'src/app/shared/model/message.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { CreateMessageInput } from '../../tour-authoring/model/create-message-input.model';
import { ProblemStatus } from '../../tour-execution/model/problem-status.model';

@Component({
  selector: 'xp-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  @Output() profileInfoUpdated = new EventEmitter<null>();
  @ViewChild('messagesContainer') private messagesContainer: ElementRef
  progressPercent: number = 0;
  minXp: number = 0;
  maxXp: number = 0;
  currentXp: number = 0;
  nameSurname: string = '';
  profileInfo: ProfileInfo;
  selectedProfileInfo: ProfileInfo;
  followers: Follower[] = [];
  tourist: Tourist | undefined;
  shouldEdit: boolean = false;
  shouldRenderProfileInfoForm: boolean = false;
  userId: number = 0;
  imageUrl: string = '';
  imageBase64: string = '';
  isEditMode: boolean = false;
  followedProfiles: number[] = [];
  loggedInUser: User;
  loggedInProfile: ProfileInfo;
  isUserLoggedIn: boolean = true;
  isAuthor: boolean = false;
  routeSubscription: Subscription;
  viewedUser: User | null = null;
  viewedUserAuthor: boolean = false;
  problems: Problem[] = [];
  resultProblems: Problem[] = []
  tours: Tour[] = [];
  problemTourMap: Map<number, boolean> = new Map<number, boolean>();
  selectedProblem: Problem | null = null;
  selectedDate: string = '';
  selectedProblemMessages: Message[] = [];
  newMessageContent: string = '';
  currentTourist : Tourist;
  opositeUser : User;
  isStatusModalOpen: boolean = false;
  statusProblem: Problem | null = null;
  statusUpdate = {
  isResolved: null as boolean | null,
  comment: ''
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AdministrationService,
    private tourService: TourService,
    private authService: AuthService,
    private executionService: TourExecutionService,
    private authoringService: TourAuthoringService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.reloadComponent();
      }
    });

    this.initializeComponent();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private initializeComponent(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.userId) {
      this.isUserLoggedIn = false;
      return;
    }

    this.authService.user$.subscribe({
      next: (user) => {
        if (!user) {
          this.isUserLoggedIn = false;
        } else {
          this.loggedInUser = user;
          this.isAuthor = user.role === 'author';
          this.service.getProfileInfoByUserId(this.loggedInUser.id).subscribe({
            next: (profile) => {
              this.loggedInProfile = profile;
              console.log('Logged-in profile fetched:', this.loggedInProfile);
            },
            error: (err) => {
              console.error('Error fetching logged-in profile:', err);
            }
          });
        }
      },
      error: () => {
        this.isUserLoggedIn = false;
      }
    });

    if (this.isUserLoggedIn) {
      this.loadData(this.userId);
      this.loadProblems(this.userId);
    }
  }
  loadProblems(idOfUser : number): void {
    this.executionService.getUserProblems(idOfUser).subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problems = result.results;
        this.resultProblems = result.results;
        this.fetchAllTours()
      },
      error: (err: any) => {
        console.log(err)
      }
      })
  }
  fetchAllTours(): void {
    this.tourService.getTour().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        this.validateProblems();
      },
      error: (err: any) => {
        console.error('Error fetching tours:', err);
      },
    });
  }
  validateProblems(): void {
    this.problems.forEach((problem) => {
      if (problem.id !== undefined) {
        const exists = this.tours.some((tour) => tour.id === problem.tourId);
        this.problemTourMap.set(problem.id, exists);
      }
    });
  }
  getTouristName(userId: number): string {
    //const user = this.users.find((u) => u.userId === userId); // Match with `id` from `Account`
    return this.loggedInUser.username;
  }
  
  getTourName(tourId: number): string {
      const tour = this.tours.find((t) => t.id === tourId);
      return tour ? tour.name : 'Unknown Tour';
  }
  
  getCategoryName(category: Category): string {
      return Category[category] || 'Unknown';
  }
  
  getProblemStatus(problem: Problem): string {
    const currentDate = new Date();
    const dueDate = new Date(problem.resolution.deadline);
    
    if (problem.resolution.isResolved) {
      return 'Resolved';
    } else if (currentDate > dueDate) {
      return 'Overdue';
    } else {
      return 'Unresolved';
    }
  }
  toggleProblemModal(problem: Problem): void {
    this.selectedProblem = problem;
    this.loadOpositeUser(this.selectedProblem);
    const problemDescriptionMessage: Message = {
      id: 0,
      problemId: problem.id!,
      userId: problem.userId,
      content: problem.details.description,
      postedAt: problem.resolution?.reportedAt || new Date()
    };
  
    this.selectedProblemMessages = [problemDescriptionMessage, ...(problem.messages || [])];
    this.loadCurrentTourist(problem.userId);
  }
  loadCurrentTourist(touristId : number){
    this.tourService.getTouristById(touristId).subscribe({
      next: (result: Tourist) => {
        this.currentTourist = result;
      },
      error: (err) => {
        console.error('Error fetching tourist username:', err);
      }
      });
  }
  closeProblemModal(): void {
    this.selectedProblem = null;
  }
  
  updateSelectedDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
  }
  
  handleSendMessageClick(): void {
    if (!this.newMessageContent.trim()) {
      return;
    }
    if (!this.selectedProblem) return;
    
    const message: CreateMessageInput = {
      problemId: this.selectedProblem.id!,
      content: this.newMessageContent
    };
    
    this.authoringService.createMessage(message, this.loggedInUser.role).subscribe({
      next: (result: PagedResults<Message>) => {
        //Deskripcija
        const problemDescriptionMessage: Message = {
          id: 0,
          problemId: this.selectedProblem!.id!,
          userId: this.selectedProblem!.userId,
          content: this.selectedProblem!.details.description,
          postedAt: new Date(this.selectedProblem!.resolution.reportedAt)
        };
  
        // Kombinovanje opisa i novih poruka
        this.selectedProblemMessages = [
          problemDescriptionMessage,
          ...result.results
        ];
  
        // Azuriranje poruka problema
        this.selectedProblem!.messages = [
            problemDescriptionMessage,
            ...result.results
        ];
  
        this.newMessageContent = '';
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.error('Error sending message:', err);
      }
    });
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }, 0);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
  loadOpositeUser(selectedProblem : Problem): void {
    const tour = this.tours.find((t) => t.id === selectedProblem.tourId);
    
    if (tour !== undefined) {     
      this.tourService.getUserById(tour.authorId).subscribe({
        next: (result: User) => {
          this.opositeUser = result;
        },
        error: (err) => {
          console.error('Error fetching author username:', err);
        }
      });
    }
  }
  isDeadlineValid(deadline: Date): boolean {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    // Proverava da li je rok u budućnosti ili danas
    return deadlineDate >= today;
  }
// Otvori modal za status
  openStatusModal(problem: any): void {
    this.statusProblem = problem;
    this.statusUpdate = {
      isResolved: null,
      comment: ''
    };
    this.isStatusModalOpen = true;
  }

// Zatvori modal za status
  closeStatusModal(): void {
    this.isStatusModalOpen = false;
    this.statusUpdate = {
      isResolved: null,
      comment: ''
    };
  }

// Podnesi ažuriranje statusa
  submitStatusUpdate(): void {
    if (this.statusUpdate.isResolved === null || this.statusUpdate.comment.trim() === '') {
      alert('Please select a status and add comment.');
      return;
    }
    const problemStatus : ProblemStatus = {
      isSolved : this.statusUpdate.isResolved as boolean,
      touristMessage : this.statusUpdate.comment
    }
    if(this.statusProblem !== null && this.statusProblem.id !== undefined){
      this.executionService.changeProblemStatus(this.statusProblem.id,problemStatus).subscribe({
        next: (result : Problem) => {
            const index = this.problems.findIndex(p => p.id === this.statusProblem?.id);
            if (index !== -1) {
            this.problems[index] = result;
        }
        },
        error: (err : any) => {
            console.log(err);
        }
      })
    }
    this.closeStatusModal();
  }
  sortProblemsByReportDate(event: Event): void {
    event.preventDefault()
    const sortValue = (event.target as HTMLSelectElement).value 

    if (sortValue === "latest") {
      this.problems.sort((a, b) => {
        return new Date(b.resolution.reportedAt).getTime() - new Date(a.resolution.reportedAt).getTime();
      })
    } else {
      this.problems.sort((a, b) => {
        return new Date(a.resolution.reportedAt).getTime() - new Date(b.resolution.reportedAt).getTime();
      })
    }
  }
  sortProblemsByDeadlineDate(event: Event): void {
    event.preventDefault()
    const sortValue = (event.target as HTMLSelectElement).value 

    if (sortValue === "latest") {
      this.problems.sort((a, b) => {
        return new Date(b.resolution.deadline).getTime() - new Date(a.resolution.deadline).getTime();
      })
    } else {
      this.problems.sort((a, b) => {
        return new Date(a.resolution.deadline).getTime() - new Date(b.resolution.deadline).getTime();
      })
    }
  }

  filterByStatus(event: Event): void {
    event.preventDefault()

    const selectedValue = (event.target as HTMLSelectElement).value

    if (selectedValue === "Resolved") 
      this.problems = this.problems.filter(problem => this.getProblemStatus(problem) === 'Resolved')
    else if (selectedValue === 'Unresolved')
      this.problems = this.problems.filter(problem => this.getProblemStatus(problem) === 'Unresolved')
    else if (selectedValue === 'Overdue')
      this.problems = this.problems.filter(problem => this.getProblemStatus(problem) === 'Overdue')
    else
      this.problems = this.resultProblems
  }
  searchProblems(event: Event): void {
    event.preventDefault()
    const input = (event.target as HTMLFormElement).elements[0] as HTMLInputElement
    const normalizedInput = input.value.toLowerCase()
    if (!normalizedInput.length)
      { 
        this.problems = this.resultProblems
        return
      }


    this.problems = this.problems.filter(
      problem =>
        this.getTourName(problem.tourId).toLowerCase().startsWith(normalizedInput)
    )
  }

  private reloadComponent(): void {
    this.initializeComponent();
  }

  private loadData(userId: number): void {
    if (userId) {
      this.getProfileInfoById(userId);
      this.getTouristInfoById(userId);
      this.loadFollowedProfiles();
      this.loadViewedUser(userId);
    }
  }

  loadViewedUser(userId: number): void {
    this.service.getUserById(userId).subscribe({
      next: (user) => {
        this.viewedUser = user; // Postavite user u viewedUser
        const roleAsString = user.role.toString(); // Konvertujte role u string
  
        // Provera da li je role '1'
        this.viewedUserAuthor = roleAsString === '1';
        console.log('Viewed user:', this.viewedUser);
        console.log('Is viewed user an author:', this.viewedUserAuthor);
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });
  }
  
  

  getTouristInfoById(userId: number): void {
    if (userId) {
      this.tourService.getTouristById(userId).subscribe({
        next: (result: Tourist) => {
          this.tourist = result;
          this.calculateProgress();
        },
        error: (err: any) => {
          console.error('Error fetching tourist info', err);
        }
      });
    }
  }

  loadFollowedProfiles(): void {
    this.service.getFollowedProfiles(this.loggedInUser?.id).subscribe({
      next: (ids: number[]) => {
        this.followedProfiles = ids;
        console.log('Followed profiles:', this.followedProfiles);
      },
      error: (err: any) => {
        console.error('Error fetching followed profiles', err);
      }
    });
  }

  getProfileInfoById(userId: number): void {
    if (userId) {
      this.service.getProfileInfoByUserId(userId).subscribe({
        next: (result: ProfileInfo) => {
          this.profileInfo = result;
          console.log('Fetched Profile Info:', this.profileInfo);

          this.nameSurname = `${result.firstName || ''} ${result.lastName || ''}`.trim();

          this.followers = result.followers || [];
          console.log('Followers loaded:', this.followers);
        },
        error: (err: any) => {
          console.error('Error fetching profile info', err);
        }
      });
    }
  }




  calculateProgress(): void {
    if (this.tourist) {
      const level = this.tourist.level || 1;
      const xp = this.tourist.xp || 0;

      this.minXp = (level-1) * 20;
      this.maxXp = level * 20;
      this.currentXp = this.minXp + xp;

      this.progressPercent = (xp / 20) * 100;
    }
  }

  onEditClicked(profileInfo: ProfileInfo): void {
    this.selectedProfileInfo = profileInfo;
    this.isEditMode = !this.isEditMode;

    this.service.updateProfileInfo(profileInfo).subscribe({
      next: () => {
        this.profileInfoUpdated.emit();
        this.loadData(this.userId); 
      },
      error: (err: any) => {
        console.error("Error updating profile info", err);
      }
    });
  }

  onFollowButtonClick(followedId: number): void {
    const followerId = this.loggedInUser.id; 
    const followerUsername = this.loggedInUser.username; 
    const imageUrl = this.loggedInProfile?.imageUrl;
  
    this.service.followUser(followedId, followerId, followerUsername, imageUrl).subscribe({
      next: () => {
        console.log(`Uspešno zapraćen korisnik sa ID-jem ${followedId}`);
        this.loadData(this.userId); 
      },
      error: (err) => {
        console.error(`Greška pri pokušaju praćenja korisnika sa ID-jem ${followedId}:`, err);
        alert(`Greška: Nije moguće zapratiti korisnika sa ID-jem ${followedId}`);
      },
    });
  }
  

onEditOrSaveClicked(): void {
  if (this.isEditMode) {
    this.profileInfo.imageBase64 = this.imageBase64 || this.profileInfo.imageBase64;
    this.profileInfo.imageUrl = this.imageUrl || this.profileInfo.imageUrl;


    this.service.updateProfileInfo(this.profileInfo).subscribe({
      next: (updatedProfile) => {
        console.log('Profile updated successfully:', updatedProfile);
        this.profileInfo = updatedProfile; 
        this.isEditMode = false; 
        this.imageBase64 = ''; 
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      }
    });
  } else {
    this.isEditMode = true;
  }
}


getImagePath(imageUrl: string | undefined): string {
  if (imageUrl) {
    return `${environment.webRootHost}${imageUrl}`;
  }
  return '';
}


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
  
        if (this.selectedProfileInfo) {
          this.selectedProfileInfo.imageBase64 = this.imageBase64;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  
}
  
