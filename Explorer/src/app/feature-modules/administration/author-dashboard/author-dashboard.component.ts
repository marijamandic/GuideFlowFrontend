import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { catchError, map, Observable, of } from 'rxjs';


@Component({
  selector: 'xp-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.css']
})
export class AuthorDashboardComponent implements OnInit, AfterViewInit  {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // Ovo možeš zadržati za Bar chart
  @ViewChild('doughnutChart') doughnutChart?: BaseChartDirective;
  @ViewChild('messagesContainer') private messagesContainer: ElementRef

  constructor(
    private authService: AuthService,
    private service: TourAuthoringService,
    private tourService: TourService,
    private administrationService: AdministrationService,
    private cdRef: ChangeDetectorRef
  ){}

  Math = Math;
  user: User;
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
  publishedTours: number = 0;
  purchasedTours:number = 0;
  totalSales: number = 0;
  reviewsPartition: { [key: number]: number } = {};
  showBar = false;
  showDoughnut = false;
  touristsProblem: User;
  touristCache: { [userId: number]: string } = {};
  
  
  problemStatusData: ChartData<'bar'> = {
    labels: ['Resolved', 'Unresolved', 'Overdue'],
    datasets: [
      {
        label: 'Problem Status',
        data: [0, 0, 0], // Ovi podaci će se dinamički ažurirati
        backgroundColor: ['#95e1ce', '#f06595', '#ff6f61'], // Zelena, žuta, crvena
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
        data: [0, 0, 0, 0, 0], 
        backgroundColor: ['#95e1ce', '#f06595', '#ffc107', '#ff6f61', '#339af0'], // Boje za kategorije
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
   
  
  salesLabels: string[] = []; // Test datumi
  salesData: number[] = []; // Test vrednosti
  selectedTimePeriod: string = '1m';
  

  /*salesChartData: ChartData<'line'> = {
    labels: this.salesLabels, // Datumi sa backend-a
    datasets: [
      {
        label: 'Sales Per Day',
        data: this.salesData, // Broj prodaja po danima
        borderColor: 'rgb(24, 32, 32)', // Linija grafikona
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Ispuna ispod linije
        fill: true, // Omogućava ispunu
        tension: 0.4, // Glađa linija
      },
    ],
  };

  selectTimePeriod(period: string): void {
    this.selectedTimePeriod = period;
    this.loadSalesChartData(this.user.id);
  }
  
  salesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' }, // Naslov za x osu
        grid: {
          display: false, // Isključuje vertikalne linije na x-osi
        },
      },
      y: {
        title: { display: true, text: 'Number of Purchases' }, // Naslov za y osu
        beginAtZero: true, // Počinje od nule
        grid: {
          display: false, // Isključuje vertikalne linije na x-osi
        },
      },
    },
  };*/

  selectTimePeriod(period: string): void {
    this.selectedTimePeriod = period;
    this.loadSalesChartData(this.user.id);
  }

  salesChartData: ChartData<'line'> = {
    labels: this.salesLabels,
    datasets: [
      {
        label: 'Sales Per Day',
        data: this.salesData,
        borderColor: 'rgb(24, 32, 32)',
        backgroundColor: 'rgba(132, 220, 198, 0.2)',
        fill: true,
        tension: 0.4
      },
    ],
  };

  // Definisanje opcija za grafikon
  salesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false, position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
        grid: { display: false },
        ticks: {
          autoSkip: true,
          maxRotation: 0
        },
      },
      y: {
        title: { display: true, text: 'Number of Purchases' },
        beginAtZero: true,
        grid: { display: false },
      },
    },
  };


  // ■■■■■ Init mate ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  ngOnInit(): void {
    this.loadProblems();
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
    this.loadAverageGrade(this.user.id); 
    this.loadReviewsPartition(this.user.id);
    this.loadTotalPublishedTours(this.user.id);
    this.loadTotalPurchasedTours(this.user.id);
    this.loadTotalSales(this.user.id);
    this.loadSalesChartData(this.user.id);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.generateSourceChartData(); // Update Problem Source Chart
      this.generateChartData();      // Update Problem Status Chart
      this.cdRef.detectChanges();    // Refresh Angular view
  
      if (this.doughnutChart) {
        this.doughnutChart.update(); // Refresh Doughnut Chart
      }
  
      if (this.chart) {
        this.chart.update();         // Refresh Bar Chart
      }
    }, 0);
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

 

  // ■■■■■ General numbers ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    loadTotalPublishedTours(authorId:number): void{
      this.administrationService.getTotalPublishedTours(authorId).subscribe({
        next: (result) => {
          this.publishedTours = result;
         console.log('***published tours',result);
        },
        error: (err) => {
          console.error('Error geting published tours:', err);
        },
      });
    }
  
    loadTotalPurchasedTours(authorId:number): void{
      this.administrationService.getTotalPurchasedTours(authorId).subscribe({
        next: (result) => {
          this.purchasedTours = result;
         console.log('***purchased tours',result);
        },
        error: (err) => {
          console.error('Error geting purchased tours:', err);
        },
      });
    }
  
    loadTotalSales(authorId:number): void{
      this.administrationService.getTotalSales(authorId).subscribe({
        next: (result) => {
          this.totalSales= result;
         console.log('***total sales:',result);
        },
        error: (err) => {
          console.error('Error geting total sales:', err);
        },
      });
    }

      loadSalesChartData(authorId: number) { 
        let dataObservable;
    
        switch (this.selectedTimePeriod) {
            case '1m':
                dataObservable = this.administrationService.getSalesData1m(authorId);
                break;
            case '3m':
                dataObservable = this.administrationService.getSalesData3m(authorId);
                break;
            case '6m':
                dataObservable = this.administrationService.getSalesData6m(authorId);
                break;
            case '1y':
                dataObservable = this.administrationService.getSalesData1y(authorId);
                break;
        }
    
        if (dataObservable) {
            dataObservable.subscribe((data: { [key: string]: number }) => {
                // Sortiraj podatke po datumu
                const sortedData = Object.entries(data).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
    
                // Podeli ključeve (datume) i vrednosti (broj prodaja)
                const sortedLabels = sortedData.map(entry => {
                    return new Date(entry[0]).toLocaleDateString('default', { month: 'short', day: 'numeric' });
                });
                const sortedValues = sortedData.map(entry => entry[1]);
    
                // Ažuriraj Chart.js podatke
                this.salesLabels = sortedLabels; // Hronološki poredjani datumi
                this.salesData = sortedValues; // Broj prodaja
    
                this.salesChartData.labels = this.salesLabels;
                this.salesChartData.datasets[0].data = this.salesData;
    
                // Osveži grafikon
                if (this.chart) {
                    this.chart.update();
                }
            });
        }
    }

  // ■■■■■ Problems table ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  loadProblems(): void {
    this.service.getProblemsByAuthorId().subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problems = result.results;
        this.resultProblems = result.results;
        this.fetchAllTours();
        this.generateSourceChartData();
        this.generateChartData();
        this.showBar = true;
        this.showDoughnut = true;
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

  getTouristName(userId: number): Observable<string> {
    if (this.touristCache[userId]) {
      return of(this.touristCache[userId]);
    }
    return this.tourService.getUserById(userId).pipe(
      map((result: User) => {
        this.touristCache[userId] = result.username;
        return result.username;
      }),
      catchError((err) => {
        console.error('Error fetching tourist username:', err);
        return of('Error');
      })
    );
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
    const resolved = this.problems.filter((p) => this.getProblemStatus(p) === 'Resolved').length;
    const unresolved = this.problems.filter((p) => this.getProblemStatus(p) === 'Unresolved').length;
    const overdue = this.problems.filter((p) => this.getProblemStatus(p) === 'Overdue').length;
  
    // Update chart data
    this.problemStatusData.datasets[0].data = [resolved, unresolved, overdue];
  
    // Force chart refresh
    setTimeout(() => {
      if (this.chart) {
        this.chart.update();
      } else {
        console.error('Problem Status Chart not found or not initialized.');
      }
      this.cdRef.detectChanges(); // Force Angular view refresh
    }, 0);
  }

  generateSourceChartData(): void {
    const categoryCounts: Record<string, number> = {
      Transportation: 0,
      Accommodation: 0,
      Guide: 0,
      Organization: 0,
      Safety: 0,
    };
  
    this.problems.forEach((problem) => {
      const categoryKey = Category[problem.details.category] as string;
      if (categoryCounts[categoryKey] !== undefined) {
        categoryCounts[categoryKey]++;
      }
    });
  
    this.problemSourceData.datasets[0].data = Object.values(categoryCounts);
  
    setTimeout(() => {
      if (this.doughnutChart) {
        this.doughnutChart.update(); // Osveži Doughnut chart
      }
    }, 0);
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
