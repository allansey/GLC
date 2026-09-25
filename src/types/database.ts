export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    created_at: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image_url: string | null;
    recurring: boolean;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Sermon {
    id: string;
    title: string;
    speaker: string;
    date: string;
    description: string | null;
    scripture_reference: string | null;
    series: string | null;
    video_url: string | null;
    audio_url: string | null;
    thumbnail_url: string | null;
    notes_url: string | null;
    is_featured: boolean;
    is_published: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export interface NewsletterSubscriber {
    id: string;
    email: string;
    is_active: boolean;
    created_at: string;
}

export interface PrayerRequest {
    id: string;
    name: string;
    email: string | null;
    request: string;
    is_private: boolean;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export type Database = {
    public: {
        Tables: {
            contact_submissions: {
                Row: ContactSubmission;
                Insert: Omit<ContactSubmission, 'id' | 'created_at'>;
                Update: Partial<Omit<ContactSubmission, 'id' | 'created_at'>>;
            };
            events: {
                Row: Event;
                Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>;
            };
            sermons: {
                Row: Sermon;
                Insert: Omit<Sermon, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Sermon, 'id' | 'created_at' | 'updated_at'>>;
            };
            newsletter_subscribers: {
                Row: NewsletterSubscriber;
                Insert: Omit<NewsletterSubscriber, 'id' | 'created_at'>;
                Update: Partial<Omit<NewsletterSubscriber, 'id' | 'created_at'>>;
            };
            prayer_requests: {
                Row: PrayerRequest;
                Insert: Omit<PrayerRequest, 'id' | 'created_at'>;
                Update: Partial<Omit<PrayerRequest, 'id' | 'created_at'>>;
            };
        };
    };
};

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Form Types
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface EventFormData {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image_url?: string;
    recurring: boolean;
    is_active: boolean;
    display_order: number;
}

export interface SermonFormData {
    title: string;
    speaker: string;
    date: string;
    description?: string;
    scripture_reference?: string;
    series?: string;
    video_url?: string;
    audio_url?: string;
    thumbnail_url?: string;
    notes_url?: string;
    is_featured: boolean;
    is_published: boolean;
}
