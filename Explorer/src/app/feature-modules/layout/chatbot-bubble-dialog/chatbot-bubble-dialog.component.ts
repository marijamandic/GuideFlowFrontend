import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChatLog, ChatMessage, Sender } from '../model/chatlog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { LayoutService } from '../layout.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'app-chatbot-bubble-dialog',
  templateUrl: './chatbot-bubble-dialog.component.html',
  styleUrls: ['./chatbot-bubble-dialog.component.css']
})
export class ChatbotBubbleDialogComponent implements OnInit {
  @ViewChild('chatbody')chatbody!: ElementRef
  @Input() dialogPosition: { left: number; top: number } = { left: 0, top: 0 };
  @Input() isDialogOpen = false;
  @Output() isDialogOpenChange = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService, 
    private layoutService: LayoutService
  ){}

  user: User
  chatLog: ChatLog
  newMessage: string = '';
  Sender = Sender
  debouncedChatLogUpdate: () => void;
  
  ngOnInit(): void {
    this.debouncedChatLogUpdate = this.debounce(this.updateChatLog.bind(this), 500);
    this.authService.user$.subscribe((user) => {
      this.user = user
      if (this.user.username === "")
        return

      this.layoutService.GetUserChatLog(this.user.id).subscribe({
        next: (result: ChatLog) => {
          this.chatLog = result
        }
      })
    })
  }

  sendMessage() {
    if (this.newMessage.trim() === '') 
      return
    const newchatMessage = {
      content: this.newMessage,
      sender: Sender.User
    }as ChatMessage
    this.chatLog.messages.push(newchatMessage);
    this.newMessage = ''; 
    this.layoutService.GenerateChatBotResponse(newchatMessage).subscribe({
      next: (result: ChatMessage) => {
        console.log(result);
        this.chatLog.messages.push(result)
        setTimeout(() => this.scrollToBottom(), 0); // before and after?
        this.debouncedChatLogUpdate()
      }
    })
  }

  updateChatLog(){
    this.layoutService.UpdateChatLog(this.chatLog).subscribe()
  }

  closeChat()
  {
    this.isDialogOpen = false;
    this.isDialogOpenChange.emit(this.isDialogOpen)
  }

  scrollToBottom() {
    const chatBodyElement = this.chatbody.nativeElement;
    chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
  }

  debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {func.apply(this, args); console.log('Debounced function executed');},wait);
    };
  };
  
  get placeholder(): string {
    return this.user && this.user.username !== '' ? 'Ask away ...' : 'Please login in order to use me';
  }

  isTourLink(content: string): boolean {
    // Proverava da li poruka sadrži format "(NazivTure,ID)"
    const tourLinkPattern = /\((.+?),(\d+)\)/;
    return tourLinkPattern.test(content);
  }
  
  getTourLink(content: string): string {
    // Generiše URL za turu na osnovu ID-a
    const tourLinkPattern = /\((.+?),(\d+)\)/;
    const match = content.match(tourLinkPattern);
    return match ? `/tour-more-details/${match[2]}` : '';
  }
  
  getTourName(content: string): string {
    // Ekstrahuje naziv ture
    const tourLinkPattern = /\((.+?),(\d+)\)/;
    const match = content.match(tourLinkPattern);
    return match ? match[1] : content;
  }
  
  getRemainingMessage(content: string): string {
    // Vraća deo poruke koji nije u formatu ture
    const tourLinkPattern = /\((.+?),(\d+)\)/;
    return content.replace(tourLinkPattern, '').trim();
  }
}