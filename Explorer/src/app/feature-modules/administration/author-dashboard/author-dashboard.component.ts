import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Problem } from 'src/app/shared/model/problem.model';
//import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourService } from '../../tour-authoring/tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';
//import { Account } from '../model/account.model';
import { Category } from 'src/app/shared/model/details.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
//import { adjustProblemsArrayResponse } from 'src/app/shared/utils/adjustResponse';
import { Message } from 'src/app/shared/model/message.model'; // Import poruka modela
import { CreateMessageInput } from '../../tour-authoring/model/create-message-input.model';
import { AdministrationService } from '../administration.service';
import { Tourist } from '../../tour-authoring/model/tourist';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';


@Component({
  selector: 'xp-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.css']
})
export class AuthorDashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private service: TourAuthoringService,
    private tourService: TourService,
    private administrationService: AdministrationService
  ){}

  Math = Math;
  user: User;
  @ViewChild('messagesContainer') private messagesContainer: ElementRef
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  // users: Account[] = []
  problems: Problem[] = [];
  resultProblems: Problem[] = []
  tours: Tour[] = [];
  currentTourist : Tourist;
  problemTourMap: Map<number, boolean> = new Map<number, boolean>();
  selectedProblem: Problem | null = null;
  selectedDate: string = '';
  selectedProblemMessages: Message[] = [];
  newMessageContent: string = '';
  averageGrade: number = 0;
  reviewsPartition: { [key: number]: number } = {};
  problemStatusData: ChartData<'bar'> = {
    labels: ['Resolved', 'Unresolved', 'Overdue'],
    datasets: [
      {
        label: 'Problem Status',
        data: [0, 0, 0], // Ovi podaci će se dinamički ažurirati
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'], // Zelena, žuta, crvena
      },
    ],
  };
  
  problemStatusOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Isključuje linije na X osi
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Isključuje linije na Y osi
        },
        ticks: {
          display: false, // Isključuje oznake na Y osi
        },
      },
    },
  };
  
  problemSourceData: ChartData<'doughnut'> = {
    labels: ['Transportation', 'Accommodation', 'Guide', 'Organization', 'Safety'],
    datasets: [
      {
        label: 'Problem Source',
        data: [0, 0, 0, 0, 0], // Podaci će se dinamički ažurirati
        backgroundColor: ['#20c997', '#f06595', '#ffc107', '#ff6f61', '#339af0'], // Boje za kategorije
      },
    ],
  };
  
  problemSourceOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      tooltip: { enabled: true },
    },
  };

  ngOnInit(): void {
    this.loadProblems();
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
    this.loadAverageGrade(this.user.id); 
    this.loadReviewsPartition(this.user.id);
  }

  // ■■■■■ Reviews sections ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  loadAverageGrade(authorId: number): void {
    this.administrationService.getAverageGradeForAuthor(authorId).subscribe({
      next: (result) => {
        this.averageGrade = result;
        // console.log(result);
      },
      error: (err) => {
        console.error('Error fetching average grade:', err);
      },
    });
  }
  
  loadReviewsPartition(authorId: number): void {
    this.administrationService.getReviewsPartitionedByGrade(authorId).subscribe({
      next: (result) => {
        this.reviewsPartition = result;
        // console.log(result);
      },
      error: (err) => {
        console.error('Error fetching reviews partition:', err);
      },
    });
  }

  getTotalRatings(): number {
    return Object.values(this.reviewsPartition).reduce((sum, count) => sum + count, 0);
  }
  
  getRatingPercentage(grade: number): number {
    const total = this.getTotalRatings();
    if (total === 0) return 0;
    return Math.round((this.reviewsPartition[grade] || 0) / total * 100);
  }

  // ■■■■■ Problems table ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  loadProblems(): void {
    this.service.getProblemsByAuthorId().subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problems = result.results;
        this.resultProblems = result.results;
        this.fetchAllTours();
        this.generateChartData();
        this.generateSourceChartData();
      },
      error: (err: any) => {
        console.error('Error fetching problems:', err);
      },
    });
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
    return this.user.username;
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

  isDeadlineExpired(deadline: Date): boolean {
    const today = new Date();
    return new Date(deadline) < today; 
  }

  toggleProblemModal(problem: Problem): void {
    this.selectedProblem = problem;

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
  
    this.service.createMessage(message, this.user.role).subscribe({
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

  saveDeadline(): void {
    
  }
  generateChartData(): void {
    // Statusi problema
    const resolved = this.problems.filter(p => this.getProblemStatus(p) === 'Resolved').length;
    const unresolved = this.problems.filter(p => this.getProblemStatus(p) === 'Unresolved').length;
    const overdue = this.problems.filter(p => this.getProblemStatus(p) === 'Overdue').length;

    this.problemStatusData.datasets[0].data = [resolved, unresolved, overdue];

    if (this.chart) {
    this.chart.update(); // Osveži grafikon
    }
  }
  generateSourceChartData(): void {
    const categoryCounts: Record<string, number> = {
      Transportation: 0,
      Accommodation: 0,
      Guides: 0, // Promenjeno da se slaže sa enumeracijom
      Organization: 0,
      Safety: 0,
    };
    
    this.problems.forEach(problem => {
      const categoryKey = Category[problem.details.category] as string; // Dobijanje ključa kao string
      if (categoryCounts[categoryKey] !== undefined) {
        categoryCounts[categoryKey]++;
      }
    });
  
    this.problemSourceData.datasets[0].data = Object.values(categoryCounts);
  
    if (this.chart) {
      this.chart.update();
    }
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
  
}
