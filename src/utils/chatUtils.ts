/**
 * Generates a dynamic conversation name from the user's question
 * @param question - The user's question/input
 * @param maxLength - Maximum length for the conversation name (default: 50)
 * @returns A formatted conversation name
 */
export function generateConversationName(question: string, maxLength: number = 50): string {
  if (!question || question.trim().length === 0) {
    return 'New Chat';
  }

  // Remove extra whitespace and newlines
  const cleaned = question.trim().replace(/\s+/g, ' ');

  // If the question is short enough, use it as-is
  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Truncate and add ellipsis
  return cleaned.substring(0, maxLength - 3) + '...';
}

/**
 * Formats a date string for display
 * @param dateString - Date string in format YYYY-MM-DD
 * @returns Formatted date string
 */
export function formatDateForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format as "Month Day, Year" or "MMM DD, YYYY"
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch (error) {
    return dateString;
  }
}

/**
 * Groups chat sessions by date
 */
export interface ChatSession {
  sessionId: string;
  question: string;
  chatname?: string;
  date: string;
}

export interface GroupedChats {
  [date: string]: ChatSession[];
}

export function groupChatsByDate(sessions: ChatSession[]): GroupedChats {
  const grouped: GroupedChats = {};

  sessions.forEach((session) => {
    const date = session.date || new Date().toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(session);
  });

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Sort sessions within each date by sessionId (or timestamp) - newest first
  sortedDates.forEach((date) => {
    grouped[date].sort((a, b) => {
      // If sessionId contains timestamp, use it for sorting
      return b.sessionId.localeCompare(a.sessionId);
    });
  });

  return grouped;
}

