import type { ConversationResponseDto, ChatMessageResponseDto } from '@/interfaces/chat';

export type UiConversation = ConversationResponseDto & { displayName: string; profileImage: string | null; subtitle?: string };
export type UiMessage = ChatMessageResponseDto;
