import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-chatbot-bubble',
  templateUrl: './chatbot-bubble.component.html',
  styleUrls: ['./chatbot-bubble.component.css']
})
export class ChatbotBubbleComponent {
  isDragging = false;
  isDialogOpen = false;
  offsetX: number = 0; 
  offsetY: number = 0; 
  bubblePosition = { top: 0, left: 0 }; 
  previousPosition = { top: 0, left: 0 }; 
  dialogPosition = {top: 0, left: 0}
  bubbleSize = 50; 
  constructor() {
    this.bubblePosition.top = 500
    this.bubblePosition.left = window.innerWidth - this.bubbleSize - 20;
    this.previousPosition = {...this.bubblePosition}
  }

  ngAfterViewInit()
  {
    this.updateBubblePosition()
  }
  
  startDragging(event: MouseEvent) {
    event.preventDefault(); 
    this.isDragging = true;
    const bubble = document.querySelector('.chatbot-bubble') as HTMLElement;
    const bubbleRect = bubble.getBoundingClientRect();
    
    
    this.offsetX = event.clientX - bubbleRect.left;
    this.offsetY = event.clientY - bubbleRect.top;
    
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }
  
  stopDragging() {
    this.isDragging = false;
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }
  
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return
    this.bubblePosition.top = event.clientY - this.offsetY;
    this.bubblePosition.left = event.clientX - this.offsetX;
    this.isDialogOpen = false;
    this.updateBubblePosition()
  }

  
  updateBubblePosition() {
    const bubble = document.querySelector('.chatbot-bubble') as HTMLElement;
    if (!bubble)  return
    bubble.style.top = `${this.bubblePosition.top}px`;
    bubble.style.left = `${this.bubblePosition.left}px`;
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.stopDragging();
    this.snapToSide();
  }

  snapToSide() {
    const innerWidth = window.innerWidth;
    const scrollBarWidth = 20; 

    const distanceToLeft = this.bubblePosition.left;
    const distanceToRight = innerWidth - (this.bubblePosition.left + this.bubbleSize);
    
    if (this.bubblePosition.top < 0 || this.bubblePosition.top > innerHeight - this.bubbleSize)
      {  
        this.bubblePosition = {... this.previousPosition}
      }
      else{
        if (distanceToLeft < distanceToRight) 
          this.bubblePosition.left = 0; 
        else {
          this.bubblePosition.left = innerWidth - this.bubbleSize - scrollBarWidth; 
        }
        this.previousPosition = {... this.bubblePosition}
  }
  this.updateBubblePosition();
  this.updateDialogPosition();
}

  updateDialogPosition(){
    if(this.bubblePosition.left == 0)
      this.dialogPosition = {top: this.bubblePosition.top, left: 0}
    else
      this.dialogPosition = {top: this.bubblePosition.top, left: window.innerWidth - 15 - 380}
  }

  openChatDialog() {
    const dialogHeight = 520; 

    const bubbleBottom = this.bubblePosition.top + this.bubbleSize;

    if (bubbleBottom + dialogHeight + 20> window.innerHeight)
        this.bubblePosition.top = window.innerHeight - dialogHeight - this.bubbleSize - 40; 

    this.isDialogOpen = true; 
    this.updateBubblePosition(); 
    this.updateDialogPosition();
  }

  closeChatDialog() {
    this.isDialogOpen = false;
  }
}
