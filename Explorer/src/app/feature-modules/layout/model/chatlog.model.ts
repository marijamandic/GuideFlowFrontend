export interface ChatLog{
    id: number,
    userId: number,
    messages: ChatMessage []
    createdAt: Date

}

export interface ChatMessage{
    content: string,
    sender: Sender

}

export enum Sender{
    Chatbot,
    User
}