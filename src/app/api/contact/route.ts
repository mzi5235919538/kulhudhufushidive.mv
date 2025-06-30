import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configure for static export
export const dynamic = 'force-static';
export const revalidate = false;

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const MESSAGES_FILE = join(process.cwd(), 'data', 'messages.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    const { mkdir } = await import('fs/promises');
    await mkdir(dataDir, { recursive: true });
  }
}

// Load messages from file
async function loadMessages(): Promise<ContactMessage[]> {
  try {
    await ensureDataDirectory();
    if (existsSync(MESSAGES_FILE)) {
      const data = await readFile(MESSAGES_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

// Save messages to file
async function saveMessages(messages: ContactMessage[]): Promise<void> {
  try {
    await ensureDataDirectory();
    await writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving messages:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name, email, and message are required' 
      });
    }

    // Create new message
    const newMessage: ContactMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone: phone || '',
      service: service || '',
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Load existing messages and add new one
    const messages = await loadMessages();
    messages.unshift(newMessage); // Add to beginning of array (most recent first)

    // Save messages
    await saveMessages(messages);

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully',
      id: newMessage.id
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    const messages = await loadMessages();

    if (messageId) {
      // Get specific message
      const message = messages.find(m => m.id === messageId);
      if (!message) {
        return NextResponse.json({ 
          success: false, 
          error: 'Message not found' 
        });
      }
      return NextResponse.json({ success: true, message });
    } else {
      // Get all messages
      return NextResponse.json({ success: true, messages });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message ID is required' 
      });
    }

    const messages = await loadMessages();
    const messageIndex = messages.findIndex(m => m.id === id);

    if (messageIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message not found' 
      });
    }

    // Update message
    messages[messageIndex] = { ...messages[messageIndex], read: read !== undefined ? read : true };
    
    await saveMessages(messages);

    return NextResponse.json({ 
      success: true, 
      message: 'Message updated successfully' 
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message ID is required' 
      });
    }

    const messages = await loadMessages();
    const filteredMessages = messages.filter(m => m.id !== messageId);

    if (messages.length === filteredMessages.length) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message not found' 
      });
    }

    await saveMessages(filteredMessages);

    return NextResponse.json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
