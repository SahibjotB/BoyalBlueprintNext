import { ChatContext, ChatHistoryItem } from "../types/chat";
import { Property } from "../types/property";

const PROPERTY_RESULTS_KEY = "property_results";
const CHAT_KEY = "chat_history";
const CHAT_CONTEXT_KEY = "chat_context"

/* Property Saving Functions */
export function saveProperties(properties: Property[]) {
    sessionStorage.setItem(PROPERTY_RESULTS_KEY, JSON.stringify(properties));
}

export function getSavedProperties(): Property[] {
    const propertiesJSON = sessionStorage.getItem(PROPERTY_RESULTS_KEY);  
    if (propertiesJSON) {
        return JSON.parse(propertiesJSON) as Property[];
    }
    return [];
}
 
export function clearSavedProperties() {
    sessionStorage.removeItem(PROPERTY_RESULTS_KEY);
}

export function getProperty(propertyID: string): Property | null {
    const properties = getSavedProperties();
    return properties.find((p) => p.id === propertyID) || null;
}

/* Chat Context Functions */
export function saveChatContext(chatContext: ChatContext) {
    sessionStorage.setItem(CHAT_CONTEXT_KEY, JSON.stringify(chatContext))
}

export function getSavedChatContext(): ChatContext | null {
    const chatContextJSON = sessionStorage.getItem(CHAT_KEY);
    if (chatContextJSON) {
        return JSON.parse(chatContextJSON) as ChatContext;
    }
    return null;
}

/** Safe merge update */
export function updateChatContext(patch: Partial<ChatContext>) {
  const existing = getSavedChatContext() ?? {};

  const updated: ChatContext = {
    ...existing,
    ...patch,
  };

  saveChatContext(updated);
}

/* Chat History Functions */
export function saveChatHistory(chatHistory: ChatHistoryItem[]) {
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(chatHistory));
}

export function getSavedChatHistory(): ChatHistoryItem[] {
    const chatHistoryJSON = sessionStorage.getItem(CHAT_KEY);
    if (chatHistoryJSON) {
        return JSON.parse(chatHistoryJSON) as ChatHistoryItem[];
    }
    return [];
}

export function clearSavedChatHistory() {
    sessionStorage.removeItem(CHAT_KEY);
}